# This is a sample Python script.
import os
import shutil


# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
def do_path_replace(path):
    return path.replace('\\', '/')


# 获得目录下的指定类型文件
def get_dir_file(srcPath, file_type):
    print(f'dir_file_path:', srcPath)
    apk_list = []
    for maindir, subdir, file_name_list in os.walk(srcPath):
        for filename in file_name_list:
            # 绝对路径
            apath = os.path.join(maindir, filename)
            apath = do_path_replace(apath)

            # 后缀
            ext = os.path.splitext(apath)[1]

            if ext == file_type:
                apk_list.append(apath)

    return apk_list


def do_build_compile():
    print(f'---------------------开始构建---------------------')
    _creator_build_param = _ccc_exe + ' --path ' + g_project_root + ' --build ' + _ccc_param_buildpath + _ccc_param_platform + _ccc_param_apiLevel + _ccc_param_packageName
    print(_creator_build_param)
    os.system(_creator_build_param)
    print(f'---------------------构建完成---------------------')
    print(f'---------------------开始编译---------------------')
    _creator_build_param = _creator_build_param.replace('--build', '--compile')
    print(_creator_build_param)
    os.system(_creator_build_param)
    print(f'---------------------编译完成---------------------')


def move_apk_to_output():
    _apk_list = []
    _apk_d_name = '.apk'
    if g_is_debug == 1:
        _apk_d_name = '-debug-signed.apk'
        _apk_list = get_dir_file(_creator_compile_apk_debug, '.apk')
    else:
        _apk_d_name = '.apk'
        _apk_list = get_dir_file(_creator_compile_apk_release, '.apk')

    apk_count = 0
    for apk_file in _apk_list:
        out_apk_path = _creator_out_apk_path + '/' + g_file_name + _apk_d_name
        if apk_count > 0:
            out_apk_path = _creator_out_apk_path + '/' + g_file_name + str(apk_count) + _apk_d_name
        apk_count += 1
        print('outfile: %s => %s' % (apk_file, out_apk_path))
        shutil.copy(apk_file, out_apk_path)
        print('移动文件成功: %s' % (g_file_name + _apk_d_name))


g_creator_root = "C:\CocosCreator_2.2.1"  # CocosCreator.exe 所在目录
g_project_root = "D:/linzhangfeng/MyGithub/XiangJiangQiPai/Client/momoqipai_login"  # 工程目录
g_build_path = "D:/linzhangfeng/build"  # 构建路径

g_version = "1.1.1"  # 版本号: 1.1.1
g_app_name = "湘江棋牌"  # 应用名: 火特娱乐991
g_package_id = "org.xiangjiang.game"  # 包名: org.HTQP.game
g_android_bak = "android-26"  # android
g_android = "android"  # android
g_file_name = "xiangjiang"  # 指定输出文件名
g_is_debug = 1  # 调式模式
# ccc-init
_ccc_exe = g_creator_root + '/CocosCreator.exe --nologin'
_ccc_exe = do_path_replace(_ccc_exe)

_ccc_param_packageName = 'packageName=' + g_package_id + ';'
_ccc_param_buildpath = 'buildPath=' + g_build_path + ';'
_ccc_param_apiLevel = 'apiLevel=android-26' + ';'
_ccc_param_platform = 'platform=android' + ';'
_creator_compile_apk_release = g_build_path + '/jsb-link/publish/android'
_creator_compile_apk_debug = g_build_path + '/jsb-link/simulator/android'

_creator_out_apk_path = g_project_root + '/../build/apk'


def print_hi(name):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press Ctrl+F8 to toggle the breakpoint.

    # 开始构建编译
    do_build_compile()

    # 移动app到指定文件夹
    move_apk_to_output()


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    print_hi('PyCharm')

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
