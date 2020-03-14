var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* asyncHander function */
function asyncHandler(cb){

    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){

        res.status(500).send(error);
      }
    }
  }

  /* gets all of the books sorted by last updated */
  router.get('/', asyncHandler(async (req,res)=>{
    const books = await Book.findAll({ order: [['updatedAt', 'DESC']]})
     res.render("index", {books})

  })
);

/* Shows the full list of books */
router.get('/books', asyncHandler(async (req,res)=>{
  const books = await Book.findAll({ order: [['updatedAt', 'DESC']]})
   res.render("index", {books})

})
);

  /*  Shows the create new book form */
  router.get('/new', asyncHandler(async (req, res) =>{
      res.render("new-book", { book: { } })
  })) ;

/* Posts a new book */
router.post('/books/new' , asyncHandler(async(req, res) => {
  let book;
 try {
   book = await Book.create(req.body);
     res.redirect("/" );
    } catch(error){
      if(error.name === 'SequelizeValidationError'){
        book = await Book.build();
        res.render("new-book" , {book, errors: error.errors})
      } else {
      throw error;
      }
    }
  }
));

/* Shows book detail form */
router.get('/books/:id', asyncHandler(async (req, res, next) => {
    Book.findByPk(req.params.id)
    .then(function(book){
    if(book){
        res.render("update-book", { book, title: book.title })
    }
    else {
        res.sendStatus(404);

     }
        })
            }
                 ))

  /* Updates book */
router.post('/books/:id', asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if(book) {
       await book.update(req.body);
        res.redirect("/") }

      } catch( error) {
          if(error.name === 'SequelizeValidationError'){
           book = await  Book.build(req.body);
             book.id = req.params.id;
        res.render("update-book", { book, errors:error.errors })
    } else {
      throw error;
    }
      }
        })
          )

/* Deletes a book */
router.post('/books/:id/delete', asyncHandler(async(req, res, next) => {
     book = await Book.findByPk(req.params.id)
    if(book){
        book.destroy();
        res.redirect("/")
    } else {
        res.sendStatus(404);
    }
      }
        ));


module.exports = router;
