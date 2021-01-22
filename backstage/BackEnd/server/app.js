var m_server = require('./server');
var m_config = require('./config');

m_server.start(m_config.server());

//连接数据库
var m_db = require('../util/db');
m_db.init(m_config.mysql());