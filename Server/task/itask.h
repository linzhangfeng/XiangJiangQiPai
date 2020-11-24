#ifndef ITASK_H
#define ITASK_H


class ITask
{
public:
	virtual ~ITask() {};

	virtual void Run() = 0 ;
};



#endif