/**
 * Add isYearLast property to allAritcles response data.
 */
exports.addYearLastPost = (allArticles) => {
  const years = [];
  const result = allArticles.map((item, index) => {
    const year = new Date(item.created_time).getFullYear();
    const isYearLast = !exports.hasInArr(year, years);
    years.push(year);
    return Object.assign({ isYearLast }, item);
  });
  return result;
};


exports.hasInArr = (target, arr) =>
  new Set(arr).size === new Set([...arr, target]).size;


/**
 * 根据传入参数类型的不同，函数会作出不同的反应：
 *
 * Number: 会被作为 code 值。例如传入 0，函数会返回 { code: 0, data: {}, message: '成功' }
 * 传入 1，函数会返回 { code: 1, data: {}, message: '无效参数' }
 *
 * String: 会被作为 message 值。返回 { code: 0, data: {}, message: String }
 *
 * Object: 会被作为整个 res 对象，但是不需要传入所有 res 应有的属性，
 * 比如传入 { data: 1 } 回返回 { code: 0, message: '成功', data: 1 }
 * 自动补全了 code 和 message 属性。
 *
 */
exports.resProxy = function resProxy(r) {
  if (!exports.hasInArr(typeof r, ['string', 'number', 'object'])) {
    throw new Error('Function resProxy got an incorrect type param');
  }

  let code;
  let data;
  let message;
  const typeDo = {
    number() {
      code = r;
    },
    string() {
      message = r;
    },
    object() {
      code = r.code;
      data = r.data;
      message = r.message;
    },
  };

  typeDo[typeof r]();

  const res = {
    code: 0,
    message: '成功',
    data: {},
  };

  const codeStrategies = {
    '-1': '未知错误',
    0: '成功',
    1: '无效参数',
    2: '数据查询异常',
  };

  if (typeof data !== 'undefined') {
    Object.assign(res, { data });
  }

  if (typeof code !== 'undefined') {
    Object.assign(res, { code });
  }

  if (typeof message !== 'undefined') {
    Object.assign(res, { message });
  } else if (res.code in codeStrategies) {
    Object.assign(res, { message: codeStrategies[res.code] });
  } else {
    Object.assign(res, { message: 'Unknown Error Code' });
  }

  return res;
};
