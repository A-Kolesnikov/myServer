const {getCategories} = require('../data_managers/categoriesManager')

let cachedCategories = null

async function initCachedCategories(){
    cachedCategories = await getCategories()
}

function getCachedCategories() {
    return cachedCategories
}

function setCachedCategories(newCategoriesArr) {
    cachedCategories = newCategoriesArr
}

module.exports = {
    initCachedCategories,
    getCachedCategories,
    setCachedCategories,
}