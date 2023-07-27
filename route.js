const express = require("express");
const User = require("./Models/userModel");
const router = express.Router();
const { Op } = require("sequelize");
const Log = require("./Models/logModel");

router.get("/", async (req, res) => {
    const { role, name, email, archive } = req.query;
    const whereClause = {};
    if (role) {
      whereClause.role = role;
    }
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`,
      };
    }
    if (email) {
      whereClause.email = {
        [Op.like]: `%${email}%`,
      };
    }
    if (archive) {
      whereClause.archive = archive === "true";
    }
    const users = await User.findAll({
      where: whereClause,
    });
    res.send(users);
  });

router.post("/", async (req, res) => {
try {
    const user = await User.create({
        ...req.body
      });
      res.send(user).status(200);
    console.log('User created successfully:', user.toJSON());
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
});

router.put("/:id", async (req, res) => {
  const user = await User.findByPk(parseInt(req.params.id));
  if (!user)
    return res.status(404).send("User not found");
  await user.update({
    ...req.body
  });
  res.send(user);
});

router.put("/email/:email", async (req, res) => {
  const user = await User.findOne({where:{email:(req.params.email)}});
  if (!user)
    return res.status(404).send("User not found");
  await user.update({
    ...req.body
  });
  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByPk(parseInt(req.params.id));
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  await user.destroy();

  res.send(user);
});

router.delete("/email/:email", async (req, res) => {
  const user = await User.findOne({where:{email:(req.params.email)}});
  if (!user)
    return res.status(404).send("The user not found.");

  await user.destroy();
  res.send(user);
});

router.get("/email/:email",async (req, res) => {
    const user = await User.findOne({where:{email:req.params.email}});
    if (!user)
      return res.status(404).send("User not found");
    res.send(user);
});

router.get("/:id",async (req, res) => {
  const user = await User.findOne({where:{id:req.params.id}});
  if (!user)
    return res.status(404).send("User not found");
  res.send(user);
});

router.post("/Logout/",async(req,res)=>{
    const user = await User.findOne({where:{email:req.body.email}});
    if (!user)
      return res.status(404).send("User not found");
    const histroy= await Log.findOne({
        where:{ UserId:user.id},
        order: [['createdAt', 'DESC']]
    });
    if(histroy){
        if(histroy.LoginStatus==="Logout")
        return res.status(404).send("User is not logged in");
        await Log.create({
            UserId:user.id,
            LoginStatus:"Logout",
            time:new Date()
        })
    }
    res.send(user);
})

router.post("/getLog/",async(req,res)=>{
    const user = await User.findOne({where:{email:req.body.email}});
    if (!user)
      return res.status(404).send("User not found");
    Log.findAll({
        where: { UserId: user.id },
        limit: 10,
        order: [['createdAt', 'DESC']],
      })
        .then((logs) => {
          if (logs.length > 0) {
            res.send(logs).status(200);
          } else {
            console.log('No logs found in the table.');
            res.send([]).status(404);
          }
        })
        .catch((error) => {
          console.error('Error fetching logs:', error);
            res.send([]).status(404);
        });
})

router.delete("/log/:id", async (req, res) => {
    const log = await Log.findByPk(parseInt(req.params.id));
    if (!log)
      return res.status(404).send("Log not found");
  
    await log.destroy();
  
    res.send(log);
  });


router.post("/Login/",async(req,res)=>{
    const user = await User.findOne({where:{email:req.body.email}});
    if (!user)
      return res.status(404).send("User not found");
    const histroy= await Log.findOne({

        where:{ UserId:user.id},
        order: [['createdAt', 'DESC']]
    });
    if(histroy){
        if(histroy.LoginStatus==="Login")
        return res.status(404).send("User already logged in");
        await Log.create({
            UserId:user.id,
            LoginStatus:"Login",
            time:new Date()
        })
        }
        
    res.send(user);
})

module.exports = router;