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
router.post('/comment/:id/reply/:commentId', authMiddleware.protect, rating.addReply);
router.put('/:id', authMiddleware.protect, rating.updateReview);
router.delete('/:id', authMiddleware.protect ,  rating.deleteReview);

router.delete('/delete/:id',  rating.deleteReviewadmin);


router.put('/:id/comments/:commentId', authMiddleware.protect , rating.updateComment);
router.delete('/:id/comments/:commentId', authMiddleware.protect , rating.deleteComment);


router.put('/:id/comments/:commentId/replies/:replyId', authMiddleware.protect, rating.updateReply);
router.delete('/:id/comments/:commentId/replies/:replyId', authMiddleware.protect , rating.deleteReply);


router.get('/my-comments',  authMiddleware.protect , rating.getCommentedReviews);

router.get('/pending', rating.getPendingReviews);

router.put('/:id/state', rating.updateReviewState);






module.exports = router
