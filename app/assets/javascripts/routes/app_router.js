Library.Router = Ember.Router.extend({
  location: 'hash',

  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      redirectsTo: 'books.index'
    }),
    books: Ember.Route.extend({
      route: '/books',
      index: Ember.Route.extend({
        route: '/',
        editBook: Ember.Route.transitionTo('edit'),
        newBook: Ember.Route.transitionTo('new'),
        connectOutlets: function(router) {
          router.
            get('applicationController').
            connectOutlet('books', Library.Book.find());
        }
      }),
      edit: Ember.Route.extend({
        route: '/:book_id/edit',
        save: function(router, book) {
          var transaction = router.
                              get('bookController').
                              get('transaction');
          transaction.commit();
          router.transitionTo('index');
        },
        cancel: function(router, book) {
          var transaction = router.
                              get('bookController').
                              get('transaction');
          transaction.rollback();
          router.transitionTo('index');
        },
        connectOutlets: function(router, book) {
          var transaction = router.get('store').transaction();
          transaction.add(book);

          router.
            get('applicationController').
            connectOutlet('book', book);

          router.
            get('bookController').
            set('transaction', transaction);
        }
      }),
      new: Ember.Route.extend({
        route: '/new',
        save: function(router, book) {
          var transaction = router.
                              get('bookController').
                              get('transaction');
          transaction.commit();
          router.transitionTo('index');
        },
        cancel: function(router, book) {
          var transaction = router.
                              get('bookController').
                              get('transaction');
          transaction.rollback();
          router.transitionTo('index');
        },
        connectOutlets: function(router) {
          var transaction = router.get('store').transaction();
          var book = transaction.createRecord(Library.Book);

          router.
            get('applicationController').
            connectOutlet('book', book);

          router.
            get('bookController').
            set('transaction', transaction);
        }
      })

    })
  })
});
