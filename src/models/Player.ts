/*===========================================================================================================
 * player.js
 * ----------------------------------------------------------------------------------------------------------
 *
 *  This file contains the player model schema.
 *
 *  The player model is a new model introduced to handle different preferences or options for each tournament. 
 *  Initially, we had both the information for the player and the user attached to the same model. However, in 
 *  order to deal with the possibility that a user may be seeded for one tournament but not another, we need to 
 *  seperate these. The way we do so is:
 *
 *  	user -> handles:
 *  		-> names
 *  		-> account info (email, password)
 *  		-> and the tournaments they play/host.
 *
 *  	player -> handles:
 *  		-> a single tournament (which they PLAY in - not host!)
 *  		-> possible their categories?
 *  		-> the userId they are associated with
 *  		-> mobile (if necessary)
 *  		-> ranking
 *  		-> seeded
 *  		-> gender
 *
 * ===========================================================================================================
*/

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Player = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    male: { type: Boolean, immuntable: true, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
    seeded: { type: Boolean, default: false },
    ranking: { type: Number, required: true, default: 0 },
});

export default mongoose.models.Player || mongoose.model("Player", Player);