#include "task_list.h"
#include "../common/common.h"
#include "../common/macros.h"
#include "../common/log.h"
using namespace std;
extern CLog g_log;

CTaskList::CTaskList() {

}


CTaskList &CTaskList::GetInstance() {
    static CTaskList tastlist;
    return tastlist;
}


void CTaskList::PushTask(std::shared_ptr <ITask> ptask) {
    lock_guard <mutex> lck(m_mutex);
    m_list.push_back(ptask);
    m_cv.notify_one();
}

std::shared_ptr <ITask> CTaskList::PopTask() {
    unique_lock <mutex> lck(m_mutex);
    m_cv.wait(lck,
              [this]() {
                  return !m_list.empty();
              });
    auto ptask = m_list.front();
    m_list.pop_front();
    g_log.info("task size:%d\n", m_list.size());
    return ptask;
}



