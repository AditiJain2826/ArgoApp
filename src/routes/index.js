const express = require("express");
const organizationRoutes = require('../organization/organization.routes');
const propertyRoutes = require('../property/property.routes');
const regionRoutes = require('../region/region.routes');
const fieldRoutes = require('../field/field.routes');
const authRoutes = require('../auth/auth.routes');
const cropRoutes = require('../crop/crop.routes');
const cropCycleRoutes = require('../cropcycle/cropcycle.routes')
const router = express.Router();
const axios = require('axios')

const passport = require("passport");
const cookieSession = require("cookie-session");
require("../config/passport-setup");

router.use(
  cookieSession({
    name: "agro",
    keys: ["key1", "key2"],
  })
);

router.use(passport.initialize());
router.use(passport.session());


const isLoggedIn = async (req,res,next)=>{
  const accessToken =  req.headers.authorization
  if(accessToken){
    try{
      const accessTokenWithoutBearer = accessToken.split(' ')[1]
      const user = await axios.request({
        url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessTokenWithoutBearer}`,
        method: "post",
      })
      req.user = user.data
      req.user.id = user.data.user_id
      next()
    }catch(err){
      res.sendStatus(401)
    }
  }else{
    res.sendStatus(401)
  }
}

router.use('/', authRoutes);
router.use('/organization',isLoggedIn, organizationRoutes);
router.use('/property', isLoggedIn, propertyRoutes);
router.use('/region', isLoggedIn, regionRoutes);
router.use('/field', isLoggedIn, fieldRoutes);
router.use('/crop', isLoggedIn, cropRoutes);
router.use('/cropcycle', isLoggedIn, cropCycleRoutes);

module.exports = router;
