// This file can be imported inside the service worker,
// which means all of its functions and variables will be accessible
// inside the service worker.
// The importation is done in the file `service-worker.js`.

console.log("External file is also loaded!")

async function chatGpt(selectedText) {
  console.log('chatGpt function called with input:', selectedText);
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "messages": [
        {
          "role": "user",
          "content":  '总结下面这段文字，分条陈述主要内容和观点，每条观点50个字符以内。\n\n输出形式：\n结论1：\n论据：\n结论2：\n论据：\n结论n：\n论据：\n\n文本：###' + selectedText + '###'
        }
      ],
      "model": "gpt-3.5-turbo",
      "max_tokens": 2048,
      "stream": true
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    let result = fetch("https://chatgpt.imur.woa.com/v1/chat/completions", requestOptions)
      .then((resp) => {
        // 处理响应流数据
        return new Promise((resolve, reject) => {
          let result = ''
          const reader = resp.body.getReader() // 创建了一个可读流的阅读器对象
          const processResult = ({ done, value }) => {
            if (done) {
              // 读取完毕，返回结果
              resolve(result)
              return
            }
            // 处理读取到的数据块
            result += new TextDecoder().decode(value)
            // console.log(result);
            reader.read().then(processResult) // 直至流读取完毕
          }
          reader.read().then(processResult) // read() 从流中读取了第一个数据块
        })
      })
      .then((result) => {
        // 处理读取到的数据
        let text = '';
        const splitResult = result.split("\n");
        splitResult.forEach(data => {
          if(data!==''&&data!=='data: [DONE]'){
            console.log("data:"+data)
            const json = JSON.parse(data.substring(6))
            text += json.choices[0].delta?.content || ''
          }
        })
        console.log('处理读取到的数据 =======', text)
        return text.replace(/\n/g, '<br>');
      })
      .catch((error) => {
        // 处理错误
        console.error('error=====', error)
      })
    return result;
  } catch (error) {
    return console.error(error);
  }
}
