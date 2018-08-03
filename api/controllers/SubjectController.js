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
    var subjects = await Subject.find().populate("tutorships");
    for(i in subjects){
      subjects[i].available = subjects[i].tutorships.length
    }
    return res.view('subjects/index', {subjects});
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
    var tutorships = await Tutorship.find({subject: req.params.id})
        .populate('subject')
        .populate('owner')
        .populate('horaries')

        //
        // ─── REMOVE SENSITIVE DATA BEFORE SENDING IT TO THE VIEW ─────────
        //  
        for (let i = 0; i < tutorships.length; i++) {
          var tutorship = tutorships[i];
          tutorship.owner = _.pick(tutorship.owner, ['name']);
    
          tutorship.is_available = await Tutorship.has_any_available(tutorship);
          tutorship.available = await Tutorship.available_horaries(tutorship);
          tutorship.available = tutorship.available.length;
    
          tutorships[i] = tutorship;
        }
        // ─────────────────────────────────────────────────────────────────

    return res.view('subjects/show', {
      tutorships: tutorships,
      subject: subject
    });
  }

};

