describe('тестирование сайта commerce-playground.lambdatest.io', () => {
     it('регистрация на сайте', () => {

        cy.clearCookies()

        cy.visit('https://ecommerce-playground.lambdatest.io/')

        cy.get('#widget-navbar-217834 > .navbar-nav > :nth-child(6) > .nav-link').click()

        cy.get('.list-group > [href="https://ecommerce-playground.lambdatest.io/index.php?route=account/register"]').click()

        cy.get('#input-firstname').type('michail')

        cy.get('#input-lastname').type('jordan')

        //система запоминает предыдущий email, поэтому нужно писать всегда новый
        cy.get('#input-email').type('minef@craft.com')

        cy.get('#input-telephone').type('7123456789')

        cy.get('#input-password').type('marginal134')

        cy.get('#input-confirm').type('marginal134')

        cy.get(':nth-child(3) > .form-group > .col-sm-10 > :nth-child(1)').click(5, 5)

        cy.get('.float-right > .custom-control').click(5, 5)

        cy.get('.float-right > .btn').click()

        cy.get('.buttons > .btn').click()

        //статус запроса проверить не могу, поскольку в логах его нет
    });

     it('авторизация на сайте', () => {

        cy.clearCookies()

        cy.visit('https://ecommerce-playground.lambdatest.io/')

        cy.get('#widget-navbar-217834 > .navbar-nav > :nth-child(6) > .nav-link').click()

        
        cy.get('#input-email').type('mine@craft.com')
        
        cy.get('#input-password').type('marginal134')

        cy.get('form > .btn').click()

        cy.get('.list-group > [href="https://ecommerce-playground.lambdatest.io/index.php?route=account/logout"]').click()

        //статус запроса проверить не могу, поскольку в логах его нет
    });
  
    it('проверка переноса пользователя на нужную страницу товара', () => {

        cy.visit('https://ecommerce-playground.lambdatest.io/')

        cy.get('#widget-navbar-217834 > .navbar-nav > :nth-child(6) > .nav-link').click()

        
        cy.get('#input-email').type('mine@craft.com')
        
        cy.get('#input-password').type('marginal134')

        cy.get('form > .btn').click()

        cy.get('#entry_217833').click(5, 5)

        cy.get(':nth-child(16) > .icon-left').click()

        cy.intercept({method: 'GET', url: '/index.php?route=product/product/*'}).as('getProduct')

        cy.get('#mz-product-grid-image-28-212408 > .carousel-inner > .active > .lazy-load').click()

        cy.wait('@getProduct').its('request.url').should('include', 'product_id=28')

    });

    it('сверка информации по продукту перед покупкой', () => {
        //переход на сайт
        cy.visit('https://ecommerce-playground.lambdatest.io/')

        cy.get('#widget-navbar-217834 > .navbar-nav > :nth-child(6) > .nav-link').click()
        //авторизация
        cy.get('#input-email').type('mine@craft.com')
        
        cy.get('#input-password').type('marginal134')

        cy.get('form > .btn').click()

        cy.get('#entry_217833').click(5, 5)

        cy.get(':nth-child(16) > .icon-left').click()

        //переход на страницу товара
        cy.get('#mz-product-grid-image-30-212408 > .carousel-inner > .active > .lazy-load').click()

        //проверка, что товар есть в наличии
        cy.get(':nth-child(4) > .badge').should('not.have.text', 'Out Of Stock')

        cy.get('#entry_216843 > .text').should('not.have.text', 'Out Of Stock')

        //"заказ"
        for (let i = 0; i < 3; i++) {
            cy.get('#entry_216841 > .input-group > .input-group-append > .btn > .fas').click()
        }

        cy.get('#entry_216843 > .text').click()

        //проверка, что нет не заполненных опций //выдает ошибку, что нужно выбрать размер продукта, в опциях нет размеров
        cy.get('#entry_216836 > .form-inline > .form-group > .text-danger').should('exist')
    });

    it('добавление продукта/ов в корзину', () => {

        cy.visit('https://ecommerce-playground.lambdatest.io/')

        cy.get('#widget-navbar-217834 > .navbar-nav > :nth-child(6) > .nav-link').click()

        //авторизация
        cy.get('#input-email').type('mine@craft.com')
        
        cy.get('#input-password').type('marginal134')

        cy.get('form > .btn').click()

        cy.get('#entry_217833').click(5, 5)

        cy.get(':nth-child(16) > .icon-left').click()

        //переход на страницу товара
        cy.get('#mz-product-grid-image-42-212408 > .carousel-inner > .active > .lazy-load').click()

        //проверка, что товар есть в наличии
        cy.get(':nth-child(4) > .badge').should('not.have.text', 'Out Of Stock')

        cy.get('#entry_216843 > .text').should('not.have.text', 'Out Of Stock')

        //проверка, что запрос был произведен правильно
        cy.intercept({method: 'POST', url: '/index.php?route=checkout/cart/add'}).as('buyProduct')

        //"заказ"
        for (let i = 0; i < 3; i++) {
            cy.get('#entry_216841 > .input-group > .input-group-append > .btn > .fas').click()
        }

        cy.get('#input-option231-216836').select(1)

        cy.get('#entry_216843 > .text').click()

        //проверка, что нет не заполненных опций 
        cy.get('#entry_216836 > .form-inline > .form-group > .text-danger').should('not.exist')

        //проверка, что сайт вернул статус запроса 200 
        cy.wait('@buyProduct').its('response.statusCode').should('eq', 200)

        
    });
})