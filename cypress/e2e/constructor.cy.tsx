describe('Тесты конструктора бургера', () => {
    const SELECTORS = {
      bun: '[data-cy="bun"]',
      main: '[data-cy="main"]',
      sauce: '[data-cy="sauce"]',
      modal: '[data-cy="modal"]',
      modalClose: '[data-cy="modal-close"]',
      constructor: '[data-cy="burger-constructor"]',
      constructorIngredients: '[data-cy="burger-constructor-ingredients"]',
      orderButton: '[data-cy="order-button"]'
    };
  
    beforeEach(() => {
      cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('createOrder');
      cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');
  
      cy.visit('/');
      cy.setCookie('accessToken', 'ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'REFRESH_TOKEN');
    });
  
    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });
  
    it('Отображает список ингредиентов', () => {
      cy.wait('@getIngredients').then(() => {
        ['bun', 'main', 'sauce'].forEach((category) => {
          cy.get(`[data-cy="${category}"]`).should('have.length.at.least', 1);
        });
      });
    });
  
    it('Открывает модальное окно с булкой', () => {
      cy.wait('@getIngredients');
      cy.fixture('ingredients.json').then((ingredientsData) => {
        const firstBun = ingredientsData.data.find((item) => item.type === 'bun');
        cy.get(SELECTORS.bun).first().click();
        cy.get(SELECTORS.modal)
          .should('be.visible')
          .and('contain.text', firstBun.name);
      });
    });
  
    it('Добавляет булку в конструктор', () => {
      cy.wait('@getIngredients');
      cy.get(SELECTORS.constructor).should('not.contain', 'верх');
      cy.get(SELECTORS.constructor).should('not.contain', 'низ');
      cy.get(SELECTORS.bun).first().find('button').click();
      cy.get(SELECTORS.constructor).within(() => {
        cy.contains('верх').should('exist');
        cy.contains('низ').should('exist');
      });
    });
  
    it('Добавляет соус в конструктор', () => {
      cy.wait('@getIngredients');
      cy.get(SELECTORS.constructorIngredients).should('not.contain', 'Соус');
      cy.get(SELECTORS.sauce).first().find('button').click();
      cy.get(SELECTORS.constructorIngredients).contains('Соус');
    });
  
    it('Добавляет начинку в конструктор', () => {
      cy.wait('@getIngredients');
      cy.get(SELECTORS.constructorIngredients).should('not.contain', 'Начинка');
      cy.get(SELECTORS.main).first().find('button').click();
      cy.get(SELECTORS.constructorIngredients).contains('Начинка');
    });
  
    it('Закрывает описание ингредиента в модальном окне по крестику', () => {
      cy.wait('@getIngredients');
      cy.get(SELECTORS.bun).first().click();
      cy.get(SELECTORS.modal).should('be.visible');
      cy.get(SELECTORS.modalClose).click();
      cy.get(SELECTORS.modal).should('not.exist');
    });
    it('Закрывает модальное окно по клику на оверлей', () => {
        cy.wait('@getIngredients');
        cy.get(SELECTORS.bun).first().click();
        cy.get(SELECTORS.modal).should('be.visible');
        cy.get('[data-cy="modal-overlay"]').click({ force: true });
        cy.get(SELECTORS.modal).should('not.exist');
      });
    it('Оформляет заказ и проверяет пустоту конструктора после оформления заказа', () => {
      cy.wait('@getIngredients');
  
      [SELECTORS.bun, SELECTORS.main, SELECTORS.sauce].forEach((selector) => {
        cy.get(`${selector} button`).first().click();
      });
  
      cy.get(SELECTORS.orderButton).click();
      cy.wait('@createOrder');
  
      cy.fixture('order.json').then((orderData) => {
        const orderNumber = orderData.order.number;
  
        cy.get(SELECTORS.modal)
          .should('be.visible')
          .and('contain.text', orderNumber);
      });
  
      cy.get(SELECTORS.modalClose).click();
      cy.get(SELECTORS.modal).should('not.exist');
  
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.get('[data-cy="constructor-element"]').should('not.exist');
      });
    });
  });
  