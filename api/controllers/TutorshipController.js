/**
 * TutorshipController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  


  index: async function (req, res) {
    var tutorships = await Tutorship.find()
        .populate('subject')
        .populate('owner')
        .populate('users')
    
    //Remove sensitive data before sending it to the view
    for (let i = 0; i < tutorships.length; i++) {
      var tutorship = tutorships[i];
      tutorship.owner = _.pick(tutorship.owner, ['name']);
      tutorship.is_available = Tutorship.is_available(tutorship);
      tutorship.available = tutorship.max - tutorship.users.length;
      tutorships[i] = tutorship;
    }

    for (let i in tutorships) {
      var tutorship = tutorships[i];
      var users = tutorship.users;
      for(let j in users){
        user = users[j];
        user = _.pick(user, ['name']);
        users[j] = user;
      }

      tutorships[i].users = users;
    }

    return res.view('tutorships/index', {
      tutorships
    });
  },

  create: async function(req, res){
    if(req.session.user.is_tutor === true){
      return res.view('tutorships/new', {subjects: await Subject.find()});
    }else{
      return res.redirectF('/tutorships', {error: ['Debes de ser tutor']});
    }
  },

  store: async function(req, res){
    //Only the tutors can create new tutorships
    if(req.session.user.is_tutor === true){
      try {
        await Tutorship.create({
          subject: req.body.subject,
          max: req.body.max,
          owner: req.session.userId
        });
        return res.redirectF('/tutorships', {success: ["Tutoria creada"]})
      } catch (error) {
        sails.log(error);
        return res.redirectF('/tutorships/new', {error: [JSON.stringify(error)]});
      }
    }else{
      return res.redirectF('/tutorships', {error: ['Debes de ser tutor']});
    }
  }, 

  show: async function(req, res){
    var tutorship = await Tutorship.find({id: req.params.id}).limit(1)
        .populate('subject')
        .populate('owner')
        .populate('users')
    tutorship = tutorship[0];
    //Remove sensitive data before sending it to the view
    tutorship.owner = _.pick(tutorship.owner, ['name']);

    tutorship.is_available = Tutorship.is_available(tutorship);  
    tutorship.available = tutorship.max - tutorship.users.length;


    var users = tutorship.users;
    for(let j in users){
      user = users[j];
      user = _.pick(user, ['name']);
      users[j] = user;
    }

    return res.view('tutorships/show', {
      tutorship
    });
  }

};

