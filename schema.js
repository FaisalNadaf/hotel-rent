const Joi = require('joi');

module.exports.listingSchema = Joi.object({
listing :Joi.object({
title:Joi.string().required(),
description:Joi.string().required(),
location:Joi.string().required(),
country:Joi.string().required(),
price:Joi.number().required(),
image:Joi.string().allow("",null),
}).required(),

});

module.exports.reviewSchema =joi.oblect({
review:joi.object({
    rating:Joi.number().required(),
    comment:Joi.string().required(),
}).required(),
    
});
