let mongoose = require('mongoose')

let PostSchema = mongoose.Schema ({
   title: {
       type: String
   },
   posterId: {
       type: String
   },
   likes: {
       type: Number
   },
   imgPath:{
       type: String
   }
})

module.exports = mongoose.model('Post',PostSchema)