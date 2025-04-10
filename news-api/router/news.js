const express = require("express");
const router=express.Router()
const newsHandler=require('../router-handler/news')
const expressJoi=require('../utils/expressJoi')
const {createnews_schema,editnews_schema,check_schema}=require('../schema/news')

router.post('/createnews',expressJoi(createnews_schema),newsHandler.createNews)
router.post('/updatedraft',expressJoi(editnews_schema),newsHandler.updateDraft)
router.get('/getnewssort',newsHandler.getNewsSort)
router.get('/getdraftlist',newsHandler.getDraftList)
router.get('/deletedraft',newsHandler.deleteDraft)
router.get('/submitdraft',newsHandler.submitDraft)
router.get('/getnewsdetail',newsHandler.getNewsDetail)
router.get('/getchecklist',newsHandler.getCheckList)
router.get('/getchecklistformanager',newsHandler.getCheckListForManager)
router.get('/drawbackcheck',newsHandler.drawbackCheck)
router.post('/agreecheck',expressJoi(check_schema),newsHandler.agreeCheck)
router.post('/opposecheck',expressJoi(check_schema),newsHandler.opposeCheck)
router.get('/publishnews',newsHandler.publishNews)//发布新闻
router.get('/offlinenews',newsHandler.offlineNews)//下线新闻
router.get('/deletenews',newsHandler.deleteNews)
router.get('/getpublishlist',newsHandler.getPublishList)//获取发布的新闻
router.get('/getcheckhistory',newsHandler.getCheckHistory)
router.post('/stoporstartnewssort',newsHandler.stopOrStartNewsSort)
router.post('/deletenewssort',newsHandler.deleteNewsSort)
router.post('/addnewssort',newsHandler.addNewsSort)
router.post('/updatenewssort',newsHandler.updateNewsSort)
router.post('/increasenewsview',newsHandler.increaseNewsView)
router.post('/increasenewslike',newsHandler.increaseNewsLike)
router.post('/decreasenewslike',newsHandler.decreaseNewsLike)
router.post('/getnewscomment',newsHandler.getNewsComment)
router.post('/addnewscomment',newsHandler.addNewsComment)

module.exports=router