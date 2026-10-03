const router=require('express').Router();
const {Metric,Rescue}=require('../models');
const {auth}=require('../middleware');
const {DAILY_GOAL,dayString,calcStreak,askClaude}=require('../services');
router.use(auth);
router.post('/',async(req,res,next)=>{try{const stepsRaw=req.body.steps,sleepRaw=req.body.sleepHours;let steps=Number(stepsRaw),sleepHours=Number(sleepRaw);if(stepsRaw!==undefined&&stepsRaw!==null&&!Number.isFinite(steps)){return res.status(400).json({error:'Steps must be a number'});}if(sleepRaw!==undefined&&sleepRaw!==null&&!Number.isFinite(sleepHours)){return res.status(400).json({error:'Sleep must be a number'});}steps=Number.isFinite(steps)?steps:0;sleepHours=Number.isFinite(sleepHours)?sleepHours:0;if(steps<0||steps>100000||sleepHours<0||sleepHours>24)return res.status(400).json({error:'Values look wrong'});res.json(await Metric.findOneAndUpdate({user:req.user.id,date:dayString(0)},{steps,sleepHours,source:req.body.source||'manual'},{upsert:true,new:true}))}catch(e){next(e)}});
router.get('/week',async(req,res,next)=>{try{const rows=await Metric.find({user:req.user.id,date:{$gte:dayString(-7)}}).sort('date');res.json({metrics:rows,streak:calcStreak(rows),goal:DAILY_GOAL})}catch(e){next(e)}});
router.post('/rescue',async(req,res,next)=>{try{const rows=await Metric.find({user:req.user.id,date:{$gte:dayString(-7)}});const streak=calcStreak(rows);const today=rows.find(r=>r.date===dayString(0));const todaySteps=today?.steps||0;if(streak===0||todaySteps>=DAILY_GOAL*.5)return res.json({atRisk:false,streak});const reducedGoal=Math.max(1,Math.floor(DAILY_GOAL*0.50));let message=`A lighter day is fine. Try ${reducedGoal.toLocaleString()} steps today and keep your rhythm going.`;const ai=await askClaude('Return ONLY JSON {\"message\":\"...\"}. Be kind. No shame or medical advice.',`Streak ${streak}; reduced goal ${reducedGoal}.`);if(ai?.message)message=ai.message;const rescue=await Rescue.create({user:req.user.id,originalGoal:DAILY_GOAL,reducedGoal,message});res.json({atRisk:true,streak,reducedGoal,message,id:rescue._id})}catch(e){next(e)}});
router.post('/rescue/:id/recovered',async(req,res,next)=>{try{res.json(await Rescue.findOneAndUpdate({_id:req.params.id,user:req.user.id},{recovered:true},{new:true}))}catch(e){next(e)}});
router.get('/payroll', auth, require('../middleware').hrOnly, async (req, res, next) => {
  try {
    const rows = await Metric.find({ user: req.user.id }).sort('date');
    res.json({ records: rows.length, avgSteps: Math.round(rows.reduce((s, r) => s + r.steps, 0) / Math.max(1, rows.length)) });
  } catch (e) { next(e); }
});
module.exports = router;
