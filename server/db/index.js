const fs = require('fs')
const mongoose = require('mongoose')
const _ = require('lodash')
require('./connection')

const entityList = {}
let defs = ``
let resolvers = {
  Query: {},
  Mutation: {}
}

const createModels = () => {
  const files = fs.readdirSync('./db/schema')
  for (const filename of files) {
    // 添加mongoose schema map list
    let model = require(`./schema/${filename}`)
    let modelName = filename.replace('.js', '')
    const entity = mongoose.model(modelName, model)
    entityList[modelName] = entity
    // 添加graphql条件查询
    let objStr = ''
    for(const prop in model.paths) {
      if (prop !== '__v') {
        let propName = model.paths[prop].path
        let instance = model.paths[prop].instance
        objStr += `${propName}:${instance === 'Number' ? 'Int' : instance === 'ObjectID' ? 'ID' : instance}` + '\n'
        
      }
    }
    
    defs += `type ${modelName} {
                ${objStr}
              }
              input Input${modelName}{
                ${objStr}
              }
             type Query {
               get${modelName}(offset: Int, limit: Int): [${modelName}]
             }
             type Mutation {
              create${modelName}(input: Input${modelName}): ${modelName}
              update${modelName}(id: ID!, input: Input${modelName}): ${modelName}
              delete${modelName}(id: ID!): String
             }
            `;    
    resolvers.Query[`get${modelName}`] = async (error, {offset, limit}) => {
      return await entity.find().skip(offset * limit).limit(limit)
    }
    resolvers.Mutation[`create${modelName}`] = async (error, {input}) => {
      return await entity.create(input)
    }
    resolvers.Mutation[`update${modelName}`] = async(error, { id, input }) => {
      await entity.findOneAndUpdate({_id: id}, input)
      let newPerson = Object.assign({}, { _id: id }, input)
      return newPerson
    }
    resolvers.Mutation[`delete${modelName}`] = async(error, {id}) => {
      let record = await entity.findOneAndDelete({"_id": id})
      return record._id.toString()
    }
  }
}
createModels()

module.exports = Object.assign(entityList, {defs, resolvers})