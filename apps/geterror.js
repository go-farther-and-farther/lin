import fs from 'node:fs'
import { segment } from 'oicq'
const errorpath = `./logs/error.log`;
export class geterror extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '发送错误日志',
            /** 功能描述 */
            dsc: '',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: "^#(lin)?(发送|获取)?报错$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'geterror'
                }, {
                    /** 命令正则匹配 */
                    reg: "^#(lin)?(删除|重置|刷新|备份)报错$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'errorback'
                },
                {
                    /** 命令正则匹配 */
                    reg: "^#(lin)?(发送|获取)?日志(文件)?$", //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'getjournal'
                }
            ]
        })
    }
    /**
     * 
     * @param e oicq传递的事件参数e
     */
    async geterror(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
         if (!fs.existsSync(errorpath)) {
            e.reply(`${errorpath}不存在。`)
        }
        //上传文件
        e.reply("可以使用“#备份报错”以刷新报错")
        if (e.isGroup) {
            e.group.fs.upload(errorpath)
            return true;
        }
        if (e.isPrivate) {
            e.friend.sendFile(errorpath)
            return true;
        }       
    }
    async getjournal(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        var date = new Date();
        let month = date.getMonth() + 1
        let journalpath = `./logs/command.${date.getFullYear()}-${month}-${date.getDate()}.log`
        if (!fs.existsSync(journalpath)) {
            e.reply(`${journalpath}不存在。`)
        }
        if (e.isGroup) {
            e.group.fs.upload(journalpath)
            return true;
        }
        if (e.isPrivate) {
            e.friend.sendFile(journalpath)
            return true;
        }
    }
    async errorback(e) {
        if (!e.isMaster) {
            e.reply([segment.at(e.user_id), `\n凡人，休得僭越！`]);
            return true
        }
        if (!fs.existsSync(errorpath)) {
            e.reply(`${errorpath}不存在报错文件。`)
        }
        else {
            var date = new Date();
            let month = date.getMonth() + 1
            let errorbackpath = `./logs/error.${date.getFullYear()}-${month}-${date.getDate()}back.log`
            fs.copyFileSync(`${errorpath}`, `${errorbackpath}`);
            e.reply(`${errorpath}存在报错，已经自动重置并备份。`)
            fs.unlink(errorpath, function (err) {
                if (err) {
                    throw err;
                }
                console.log('文件:' + errorpath + '删除成功！');
            })
        }
    }
}