const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    db:
      'mongodb+srv://t0e:UoMmBBOATnRMcRez@b2b-0az6a.mongodb.net/recyglo_b2b',
      // 'mongodb://api.test.recyglo.info:27017/recyglo_b2b',
      // "mongodb://dbAdmin:Xnr3hRV8sk@api.test.recyglo.info:27017/recyglo_b2b?authSource=recyglo_b2b",
    API_VERSION: 'api/v1',
    jwtSecret: 'recyglomm',
    refershTokenSecret: 'R3CYgl0mm',
    port: 3000,
    jwtTokenLife: '1 Day',
    refreshTokenSecretLife: 60 * 60 * 12 * 30 * 1000,
    apiKey: 'api_62FC618F2C484B9ABBEF48B79C32E92F',
  },
  production: {
    db:
      'mongodb+srv://t0e:UoMmBBOATnRMcRez@b2b-0az6a.mongodb.net/recyglo_b2b',
      // 'mongodb://api.test.recyglo.info:27017/recyglo_b2b',
      // "mongodb://dbAdmin:Xnr3hRV8sk@api.test.recyglo.info:27017/recyglo_b2b?authSource=recyglo_b2b",
    API_VERSION: 'api/v1',
    jwtSecret: 'recyglomm',
    refershTokenSecret: 'R3CYgl0mm',
    port: 80,
    jwtTokenLife: '1 Day',
    refreshTokenSecretLife: 60 * 60 * 12 * 30 * 1000,
    apiKey: 'api_62FC618F2C484B9ABBEF48B79C32E92F',
  },
};

module.exports = config[env];
