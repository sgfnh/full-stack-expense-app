const getExpenses = (req,where)=>{
    return req.signUp.getExpenses(where);
}

module.exports={
    getExpenses
}