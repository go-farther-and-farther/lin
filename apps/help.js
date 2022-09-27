import plugin from '../../../lib/plugins/plugin.js'
import { createRequire } from "module";
import puppeteer from "../../..//lib/puppeteer/puppeteer.js";
import command from '../command/command.js'
import cfg from '../../../lib/config/config.js'
const require = createRequire(import.meta.url);
const { exec, execSync } = require("child_process");
const helppath = `./plugins/lin-plugin/resources/lin帮助.txt`;
const _path = process.cwd();
const dirpath = "data/lin-plugin/";//文件夹路径
var msg = await command.getresources("help", "help");
var msg2 = await command.getresources("help", "help2");
var msg3 = await command.getresources("help", "help3");

export class help extends plugin {
	constructor() {
		super({
			/** 功能名称 */
			name: 'lin帮助',
			/** 功能描述 */
			dsc: '',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 1000,
			rule: [
				{
					/** 命令正则匹配 */
					reg: "^#(lin|麟|决斗|游戏)(规则|帮助|版本)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'helps'
				}, {
					/** 命令正则匹配 */
					reg: "^#(lin|麟|决斗|游戏)(文档|txt)(规则|帮助)$", //匹配消息正则，命令正则
					/** 执行方法 */
					fnc: 'rules'
				}
			]
		})
	}

	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
	async helps(e) {
		if (e.msg.includes('决斗') || e.msg.includes('规则'))
			msg = msg2
		if (e.msg.includes('版本'))
			msg = msg3
		let data1 = {}
		let ml = process.cwd()
		console.log(ml)
		data1 = {
			tplFile: './plugins/lin-plugin/resources/html2/2.html',
			cs: msg,
			dz: ml
		}
		let img = await puppeteer.screenshot("123", {
			...data1,
		});
		e.reply(img)
	}
	async rules(e) {
		if (e.isPrivate
		) { e.friend.sendFile(helppath) }
		else {
			e.group.fs.upload(helppath)
		}
		let command = "git pull";
		//下面是强制更新，如果需要可以替换上面这句！！！！！！！！！！！！！
		//let command = "git checkout . && git pull";
		var ls = exec(command, { cwd: `${_path}/plugins/lin-plugin/` }, async function (error, stdout, stderr) {
			let isChanges = error.toString().includes("Your local changes to the following files would be overwritten by merge") ? true : false;

			let isNetwork = error.toString().includes("fatal: unable to access") ? true : false;

			if (isChanges) {
				let msg2 = "新版本自动更新失败，请手动更新！ "
				for (let i of cfg.masterQQ) { //这里定义发送给所有主人
					let userId = i
					Bot.pickUser(userId).sendMsg(msg2)
				}
			}
		});
	}
}