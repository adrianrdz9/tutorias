/**
 * SubjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

  /**
   * `SubjectController.index()`
   */
  index: async function (req, res) {
    return res.view('subjects/index', {subjects: await Subject.find()});
  },

  create: async function(req, res){
    if(await User.is_admin({id: req.session.userId}) === true){
      return res.view('subjects/new');
    }else{
      return res.redirectF('/subjects', {error: ['Debes de ser administrador']});
    }
  },

  store: async function(req, res){
    //Only the admin can add new subjects
    if(await User.is_admin({id: req.session.userId}) === true){
      try {
        await Subject.create({
          title: req.body.title,
        });
        return res.redirectF('/subjects', {success: ["Materia agregada"]})
      } catch (error) {
        sails.log(error);
        return res.redirectF('/subjects/new', {error: [JSON.stringify(error)]});
      }
    }else{
      return res.redirectF('/subjects', {error: ['Debes de ser administrador']});
    }
  }, 

  show: async function(req, res){
    const subject = await Subject.findOne({id: req.params.id});
    const tutorships = await Subject.find({id: req.params.id}).limit(1).populate('tutorships');
    return res.view('subjects/show', {
      tutorships: tutorships.tutorships || [],
      subject: subject
    });
  }

};

