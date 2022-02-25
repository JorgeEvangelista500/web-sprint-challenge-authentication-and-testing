const db = require('../../data/dbConfig')


function find(){
    db('users')
}
function findById(id){
    return db('users').where('id', id).first()
}

function findBy(filter){
  return  db('users').where(filter)
}

async function add({username, password}){
    const [id] = await db('users').insert({ username, password })
    return findById(id)
}

module.exports = {
    find,
    findBy,
    add,
    findById,
}