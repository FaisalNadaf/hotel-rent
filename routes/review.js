
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utility/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAauthor} = require("../middleware.js");
const reviewControler = require("../controler/review.js");




  
/*---------------------------------------reviwe post route---------------------------------------------*/
router.post("/",isLoggedIn,validateReview,wrapAsync( reviewControler.createReview));
  
  /*---------------------------------------reviwe delete route---------------------------------------------*/
  router.delete("/:reviewId",isLoggedIn,isReviewAauthor,wrapAsync(reviewControler.destroyReview));
  
  
  /*---------------------------------------exports---------------------------------------------*/
  module.exports=router;