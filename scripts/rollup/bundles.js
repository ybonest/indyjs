const typesMap = {
    UMD_DEV: 'UMD_DEV',
    UMD_PROD: 'UMD_PROD',
    NODE_DEV: 'NODE_DEV',
    NODE_PROD: 'NODE_PROD'
}

const bundles = [
    {
        types: [ typesMap.UMD_DEV, typesMap.UMD_PROD, typesMap.NODE_DEV, typesMap.NODE_PROD ],
        entry: 'element',
        external: []
    }
]

module.exports = {
    bundles
}
