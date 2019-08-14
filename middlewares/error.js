module.exports = function(err,req,res,next){
    res.status(500).send({
      success: false,
      message: 'Someting failed',
      error: err
    });
  }