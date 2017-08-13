var handle = {///根据id找到data中对应的元素
	findSelfById(data, id){
		return data.find(function(val){
			return val.id == id;
		});
	},
	findParentsById(data, id){//根据idzhao到包含自己在内的子集
		var arr = [];
		var me = handle.findSelfById(data, id);//函数的作用域是在自己的作用域和全局去查找，不会在对象中查找
		if(me){
			arr.push(me);
			arr = arr.concat(handle.findParentsById(data, me.pid));
		}
		return arr;
	},
	findChildsById(data, id){//根据id找到自己的所有子集
		return data.filter(function(val){
			return val.pid == id;
		})
	},
	findAllChilds(data, id){//根据id找到他所有的子孙级别的元素
		var arr = [];
		var self = handle.findSelfById(data, id);
		arr.push(self);
		var childs = handle.findChildsById(data, self.id);
		childs.forEach(function(val){
			arr = arr.concat(handle.findAllChilds(data, val.id));
		});
		return arr;
	},
	findAllChildsByArr(data, idarr){//根据id数组找到他所有的子孙级别的元素
		var arr = [];
		
		idarr.forEach(function(val){
			arr = arr.concat(handle.findAllChilds(data, val));
		});
		
		return arr;
	},
	deleteAllChildsByArr(data, idarr){
		var childs = handle.findAllChildsByArr(data, idarr);
		
		for(var i=0; i<data.length; i++){
			for(var j=0; j<childs.length; j++){
				if(data[i] === childs[j]){
					data.splice(i,1);
					i--;
				}
			}
		}
	}
}
