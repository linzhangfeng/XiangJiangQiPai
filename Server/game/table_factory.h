#ifndef TABLE_FACTORY_H
#define TABLE_FACTORY_H

#include "table.h"
#include <memory>

class TableFactory
{
public:
	std::shared_ptr<Table> CreateTable(int game_type);
};


#endif