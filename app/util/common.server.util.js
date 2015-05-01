'use strict';
/**
 * Created by CLI on 01-05-2015.
 */
exports.addWhoFields= function(model,user){
    if(!(model.createdBy)){
        model.createdBy=user.id;
        model.createdDate=new Date();
    }
    model.lastUpdatedBy=user.id;
    model.lastUpdatedDate=new Date();
}
