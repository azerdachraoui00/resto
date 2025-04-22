const Review = require('../models/ReviewSchema');
const multer = require("multer");
const User = require('../models/User');


const mongoose = require('mongoose')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "reviews/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

async function checkTopReviewers() {
  try {
      const topReviewers = await Review.aggregate([
          {
              $group: {
                  _id: "$user",
                  reviewCount: { $sum: 1 }
              }
          },
          { $sort: { reviewCount: -1 } },
          { $limit: 3 },
          {
              $project: {
                  userId: "$_id",
                  reviewCount: 1,
                  _id: 0
              }
          }
      ]);

      if (topReviewers.length === 0) {
          console.log('Aucun reviewer trouvé');
          return;
      }

      const topUserIds = topReviewers.map(reviewer => reviewer.userId);
      await User.updateMany(
          { isTopReviewer: true },
          { $set: { isTopReviewer: false } }
      );

      await User.updateMany(
          { _id: { $in: topUserIds } },
          { $set: { isTopReviewer: true } }
      );

      console.log(`Top reviewers mis à jour : ${topUserIds.join(', ')}`);
      
  } catch (err) {
      console.error('Erreur lors de la mise à jour des top reviewers:', {
          message: err.message,
          stack: err.stack
      });
      throw err;
  }
}

const review = {
  getReviewsByUsers: async (req, res) => {
    try {
      const reviews = await Review.find({ user: req.user.id  , etat: true})
        .populate('user')
        .populate('likes')
        .populate('comments.user')
        .populate('comments.replies.user')
        .sort({ createdAt: -1 });
  
      res.status(200).json(reviews);
    } catch (err) {
      console.error('Error fetching user reviews:', err.message);
      res.status(500).send('Server error');
    }
  } , 
  getReviews: async (req, res) => {
    try {
      const reviews = await Review.find({etat: true})
        .populate('user')
        .populate('likes')
        .populate('comments.user')
        .populate('comments.replies.user')
        .sort({ createdAt: -1 });
  
      res.status(200).json(reviews);
    } catch (err) {
      console.error('Error fetching user reviews:', err.message);
      res.status(500).send('Server error');
    }
  }
 ,   
      createReview :  async (req, res) => {
        try {
            upload.single("file")(req, res, async function (err) {
                if (err) {
                  return res.status(400).json({ error: "File upload failed" });
                }
        const { description, rating } = req.body;
          const newReview = new Review({
            user : req.user.id , 
            description,
            rating,
            image : req.file.filename

          });
      
          const review = await newReview.save();
          await User.findByIdAndUpdate(req.user.id , { 
            $inc: { reviewCount: 1 } 
          });
          checkTopReviewers().catch(err => {
            console.error('Erreur secondaire dans checkTopReviewers:', err);
          });
          res.json(review);
        }  )} catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
      },


      addComment : async (req, res) => {

        const { text } = req.body;
        try {
          const review = await Review.findById(req.params.id);
          const newComment = {
            user: req.user.id,
            text
          };
      
          review.comments.unshift(newComment);
          await review.save();
          res.json(review.comments);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
      },


      likeReview  :  async (req, res) => {
        try {
          const review = await Review.findById(req.params.id);
                if (review.likes.some(like => like.toString() === req.user.id)) {
            review.likes = review.likes.filter(like => like.toString() !== req.user.id);
          } else {
            review.likes.unshift(req.user.id);
          }
          await review.save();
          res.json(review.likes);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
        }
      } , 

      addReply : async (req, res) => {
        try {
          const { text } = req.body;
          const { id, commentId } = req.params;

           console.log(req.body)
      
          if (!text || text.trim().length === 0) {
            return res.status(400).json({ msg: 'Le texte de la réponse est requis' });
          }
                const review = await Review.findById(id);
          if (!review) {
            return res.status(404).json({ msg: 'Review non trouvée' });
          }
                const comment = review.comments.find(c => c._id.toString() === commentId);
          if (!comment) {
            return res.status(404).json({ msg: 'Commentaire non trouvé' });
          }
                const newReply = {
            user: req.user.id,
            text: text.trim()
          };
      
          comment.replies.unshift(newReply);
      
          await review.save();
      
          await Review.populate(review, {
            path: 'comments.replies.user',
            select: 'firstName lastName profilePic'
          });
      
          const updatedComment = review.comments.find(c => c._id.toString() === commentId);
          res.json(updatedComment.replies);
      
        } catch (err) {
          console.error(err.message);
                    if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'ID non valide' });
          }
      
          res.status(500).send('Erreur serveur');
        }
      } , 

      updateReview :  async (req, res) => {
        try {
            const { description, rating } = req.body;
                  if (!description || !rating) {
                return res.status(400).json({ message: "Description et note sont requises" });
            }
    
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: "La note doit être entre 1 et 5" });
            }
    
            const review = await Review.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                { description, rating },
                { new: true }
            ).populate('user', 'firstName lastName profilePic isTopReviewer');
    
            if (!review) {
                return res.status(404).json({ message: "Avis non trouvé ou non autorisé" });
            }
    
            res.json(review);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'avis" });
        }
    } , 
    deleteReview  : async (req, res) => {
      try {
          const review = await Review.findOneAndDelete({
              _id: req.params.id,
              user: req.user.id
          });
  
          await User.findByIdAndUpdate(req.user.id, { 
            $inc: { reviewCount: -1 } 
          });
          checkTopReviewers().catch(err => {
            console.error('Erreur secondaire dans checkTopReviewers:', err);
          });
          if (!review) {
              return res.status(404).json({ message: "Avis non trouvé ou non autorisé" });
          }
  

  
          res.json({ message: "Avis supprimé avec succès" });
      } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Erreur lors de la suppression de l'avis" });
      }
  } , 



  deleteReviewadmin  : async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
        });

   
      
        if (!review) {
            return res.status(404).json({ message: "Avis non trouvé ou non autorisé" });
        }



        res.json({ message: "Avis supprimé avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la suppression de l'avis" });
    }
} , 


  updateComment : async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: "Le texte du commentaire est requis" });
        }

        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Avis non trouvé" });
        }

        const comment = review.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Non autorisé" });
        }

        comment.text = text;
        comment.updatedAt = new Date();
        await review.save();
        
        res.json(review.comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la modification du commentaire" });
    }
} , 
deleteComment : async (req, res) => {
  try {
      const review = await Review.findById(req.params.id);
      if (!review) {
          return res.status(404).json({ message: "Avis non trouvé" });
      }
      const commentIndex = review.comments.findIndex(
          c => c._id.toString() === req.params.commentId
      );

      if (commentIndex === -1) {
          return res.status(404).json({ message: "Commentaire non trouvé" });
      }
      if (review.comments[commentIndex].user.toString() !== req.user.id) {
          return res.status(403).json({ message: "Non autorisé" });
      }
      review.comments.splice(commentIndex, 1);
      review.commentCount = review.comments.length;

      await review.save();

      res.json({ 
          message: "Commentaire supprimé avec succès",
          comments: review.comments 
      });

  } catch (err) {
      console.error(err);
      res.status(500).json({ 
          message: "Erreur lors de la suppression du commentaire",
          error: err.message 
      })
  }
} , 

updateReply  : async (req, res) => {
  try {
    const { id, commentId, replyId } = req.params;
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'Le texte de la réponse est requis' 
      });
    }
    const review = await Review.findOneAndUpdate(
      {
        _id: id,
        'comments._id': commentId,
        'comments.replies._id': replyId,
        'comments.replies.user': req.user.id 
      },
      {
        $set: {
          'comments.$[comment].replies.$[reply].text': text,
          'comments.$[comment].replies.$[reply].updatedAt': new Date()
        }
      },
      {
        new: true,
        arrayFilters: [
          { 'comment._id': commentId },
          { 'reply._id': replyId }
        ]
      }
    ).populate('comments.replies.user', 'firstName lastName profilePic');

    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'Réponse non trouvée ou non autorisée'
      });
    }
    const updatedComment = review.comments.find(c => c._id.toString() === commentId);
    const updatedReply = updatedComment.replies.find(r => r._id.toString() === replyId);

    res.status(200).json({
      status: 'success',
      data: {
        reply: updatedReply
      }
    });

  } catch (err) {
    console.error('Erreur lors de la mise à jour de la réponse:', err);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue lors de la mise à jour de la réponse',
      error: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }
} , 
deleteReply : async (req, res) => {
  try {
    const { id, commentId, replyId } = req.params;

    const review = await Review.findOneAndUpdate(
      {
        _id: id,
        'comments._id': commentId,
        'comments.replies._id': replyId,
        'comments.replies.user': req.user.id 
      },
      {
        $pull: {
          'comments.$[comment].replies': { _id: replyId }
        },
        $inc: { 'comments.$[comment].replyCount': -1 }
      },
      {
        new: true,
        arrayFilters: [
          { 'comment._id': commentId }
        ]
      }
    );

    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'Réponse non trouvée ou non autorisée'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });

  } catch (err) {
    console.error('Erreur lors de la suppression de la réponse:', err);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue lors de la suppression de la réponse',
    });
  }
},

getCommentedReviews : async (req, res) => {
  try {
    const reviews = await Review.find({
      'comments.user': req.user.id
    })
    .populate('user', 'firstName lastName profilePic')
    .populate('comments.user', 'firstName lastName');

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
} , 
getPendingReviews  : async (req, res) => {
  try {
    const reviews = await Review.find({ etat: false })
      .populate('user', 'firstName lastName profilePic')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
} , 
updateReviewState  :  async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { etat : true  },
      { new: true }
    ).populate('user', 'firstName lastName');

    if (!review) {
      return res.status(404).json({ message: "Review non trouvée" });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}
} 

module.exports = review;
