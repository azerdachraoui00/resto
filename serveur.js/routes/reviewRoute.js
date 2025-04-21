const express = require("express")
const rating = require("../controllers/reviewController")
const authMiddleware = require('../middleware/protect');

const router = express.Router()


router.post('/createdrec', authMiddleware.protect,  rating.createReview)
router.get('/getreviewsByuser', authMiddleware.protect ,  rating.getReviewsByUsers)
router.get('/getreviews',   rating.getReviews)
router.get('/me', authMiddleware.protect, authMiddleware.getCurrentUser);
router.put('/like/:id', authMiddleware.protect, rating.likeReview);
router.post('/comment/:id', authMiddleware.protect, rating.addComment);

module.exports = router
