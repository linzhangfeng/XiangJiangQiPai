#ifndef TASK_LIST_H
#define TASK_LIST_H


#include <list>
#include <mutex>
#include <memory>
#include <condition_variable>
#include "itask.h"

class CTaskList {
public:
    static CTaskList &GetInstance();

    void PushTask(std::shared_ptr <ITask> ptask);

    std::shared_ptr <ITask> PopTask();

private:

    CTaskList();

    std::condition_variable m_cv;
    std::mutex m_mutex;
    std::list <std::shared_ptr<ITask>> m_list;
};


#endif