#include "task_thread.h"
#include "task_list.h"
#include "../common/common.h"
#include "../common/macros.h"
#include <thread>
#include "../common/log.h"
using namespace std;
extern CLog g_log;
void StartTaskThread(int num) {
    g_log.info(" run task thread\n");
    for (int i = 0; i < num; ++i) {
        thread([] {
            while (1) {
                auto ptask = CTaskList::GetInstance().PopTask();
                ptask->Run();
            }
        }).detach();
    }
}

