#include "table_factory.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "table_shetiqi.h"
#include "../common/log.h"

extern CLog g_log;
using namespace std;


shared_ptr <Table> TableFactory::CreateTable(int game_type) {
    switch (game_type) {
        case 1000: {
            return shared_ptr<Table>(new CTableSheTiQi);
        }
        default:
            break;
    }
    g_log.warn("not find game_type:%d", game_type);
    return nullptr;
}