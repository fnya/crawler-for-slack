// import 'reflect-metadata';
// import { Container } from 'inversify';
// import Types from '../../common-lib-for-slack/dist/lib/types/Types';
// import { IPropertyUtil } from '../../common-lib-for-slack/dist/lib/interface/IPropertyUtil';
// import { ISlackApiClient } from '../../common-lib-for-slack/dist/lib/interface/ISlackApiClient';
// import { when, mock, instance } from 'ts-mockito';
// import PropertyType from '../../common-lib-for-slack/dist/lib/types/PropertyType';
// import PropertyUtil from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
// import SlackApiClient from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';

// let container: Container;
// let propertyUtilMock: PropertyUtil;

// describe('test1', () => {
//   beforeEach(() => {
//     container = new Container();
//     propertyUtilMock = mock(PropertyUtil);

//     // テスト対象は to で実装クラスを割り当て
//     container.bind<ISlackApiClient>(Types.ISlackApiClient).to(SlackApiClient);

//     // モックは、toConstantValue でインスタンスを割り当て
//     container
//       .bind<IPropertyUtil>(Types.IPropertyUtil)
//       .toConstantValue(instance(propertyUtilMock));
//   });

//   test('test1', () => {
//     const slackApiClient = container.get<SlackApiClient>(Types.ISlackApiClient);

//     when(propertyUtilMock.getProperty(PropertyType.AdminFolerId)).thenReturn(
//       'OK'
//     );

//     const property = slackApiClient.getProperty(PropertyType.AdminFolerId);

//     console.log(property);
//   });
// });
