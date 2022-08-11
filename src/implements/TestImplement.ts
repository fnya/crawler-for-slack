import { TestInterface } from '../interface/TestInterface';

class TestImplement implements TestInterface {
  test() {
    console.log('インターフェース実行成功！！');
  }
}

export default TestImplement;
