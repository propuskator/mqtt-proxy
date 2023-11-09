/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
jest.mock('../../../../../lib/models/User', () => {});
jest.mock('../../../../../lib/models/AdminUser', () => {});
jest.mock('../../../../../lib/models/AccessSubject', () => {});
jest.mock('../../../../../lib/models/AccessSetting', () => {});
jest.mock('../../../../../lib/models/AccessReadersGroup', () => {});

const SubjectClient = require('../../../../../lib/services/aedesClients/SubjectClient');

describe('SubjectClient', () => {
    const code = 'test-code';

    describe('getPublishTopicsMatchers', () => {
        describe('POSITIVE', () => {
            it(
                'should return object with correct matchers number: ' +
                'for main relay and max supported additional relays',
                () => {
                    const maxAdditionalRelaysNumber = 50;
                    const client = new SubjectClient({
                        client                 : { id: 'test-client-id' },
                        rootTopic              : 'test-root-topic',
                        mobileToken            : 'test-mobile-token',
                        accessTokenReaderCodes : [],
                        maxAdditionalRelaysNumber
                    });

                    const result = client.getPublishTopicsMatchers(code);

                    expect(result).toBeInstanceOf(Object);
                    // additional relays number + main relay
                    expect(Object.keys(result)).toHaveLength(maxAdditionalRelaysNumber + 1);
                }
            );

            it('should return object with correct topics as keys and correct matchers handlers as values', () => {
                const maxAdditionalRelaysNumber = 3;
                const client = new SubjectClient({
                    client                 : { id: 'test-client-id' },
                    rootTopic              : 'test-root-topic',
                    mobileToken            : 'test-mobile-token',
                    accessTokenReaderCodes : [],
                    maxAdditionalRelaysNumber
                });
                const dNodeSTopic = `sweet-home/${code}/d/s/set`;
                const rNodeS1Topic = `sweet-home/${code}/r/s1/set`;
                const rNodeS2Topic = `sweet-home/${code}/r/s2/set`;
                const rNodeS3Topic = `sweet-home/${code}/r/s3/set`;

                SubjectClient.prototype.defaultAuthorizePublish = jest.fn();

                const result = client.getPublishTopicsMatchers(code);
                const dNodeSTopicFn = result[dNodeSTopic];
                const rNodeS1TopicFn = result[rNodeS1Topic];
                const rNodeS2TopicFn = result[rNodeS2Topic];
                const rNodeS3TopicFn = result[rNodeS3Topic];

                dNodeSTopicFn({}, () => {});
                rNodeS1TopicFn({}, () => {});
                rNodeS2TopicFn({}, () => {});
                rNodeS3TopicFn({}, () => {});

                expect(result).toHaveProperty(`sweet-home/${code}/d/s/set`, expect.any(Function));
                expect(result).toHaveProperty(`sweet-home/${code}/r/s1/set`, expect.any(Function));
                expect(result).toHaveProperty(`sweet-home/${code}/r/s2/set`, expect.any(Function));
                expect(result).toHaveProperty(`sweet-home/${code}/r/s3/set`, expect.any(Function));

                expect(SubjectClient.prototype.defaultAuthorizePublish)
                    .toHaveBeenNthCalledWith(
                        1,
                        expect.objectContaining({ topic: `sweet-home/${code}/d/k/set` }),
                        expect.any(Function)
                    );
                expect(SubjectClient.prototype.defaultAuthorizePublish)
                    .toHaveBeenNthCalledWith(
                        2,
                        expect.objectContaining({ topic: `sweet-home/${code}/r/k1/set` }),
                        expect.any(Function)
                    );
                expect(SubjectClient.prototype.defaultAuthorizePublish)
                    .toHaveBeenNthCalledWith(
                        3,
                        expect.objectContaining({ topic: `sweet-home/${code}/r/k2/set` }),
                        expect.any(Function)
                    );
                expect(SubjectClient.prototype.defaultAuthorizePublish)
                    .toHaveBeenNthCalledWith(
                        4,
                        expect.objectContaining({ topic: `sweet-home/${code}/r/k3/set` }),
                        expect.any(Function)
                    );
            });
        });
    });

    describe('getForwardTopicsMatchers', () => {
        describe('POSITIVE', () => {
            it(
                'should return object with correct forward matchers number: ' +
                'for main device topics and max supported additional relays',
                () => {
                    const maxAdditionalRelaysNumber = 50;
                    const rootTopic = 'test-root-topic';
                    const client = new SubjectClient({
                        client                 : { id: 'test-client-id' },
                        rootTopic,
                        mobileToken            : 'test-mobile-token',
                        accessTokenReaderCodes : [],
                        maxAdditionalRelaysNumber
                    });
                    const expectedMainMatchers = 16;
                    const matchersPerRelay = 5;
                    const expectedAdditionalRelaysMatchers = maxAdditionalRelaysNumber * matchersPerRelay;
                    const expectedTotalForwardsMatchersNumber = expectedMainMatchers + expectedAdditionalRelaysMatchers;

                    const result = client.getForwardTopicsMatchers(code);

                    expect(result).toBeInstanceOf(Object);
                    expect(Object.keys(result)).toHaveLength(expectedTotalForwardsMatchersNumber);
                }
            );

            it('should return object with correct topics as keys and correct matchers handlers as values', () => {
                const maxAdditionalRelaysNumber = 3;
                const rootTopic = 'test-root-topic';
                const client = new SubjectClient({
                    client                 : { id: 'test-client-id' },
                    rootTopic,
                    mobileToken            : 'test-mobile-token',
                    accessTokenReaderCodes : [],
                    maxAdditionalRelaysNumber
                });

                const dNodePropertiesTopic = `${rootTopic}/sweet-home/${code}/d/$properties`;
                const dNodeKSensorErrorsTopic = `${rootTopic}/errors/sweet-home/${code}/d/k`;
                const dNodeKSetSensorTopic = `${rootTopic}/sweet-home/${code}/d/k/set`;
                const rNodeK1SensorErrorsTopic = `${rootTopic}/errors/sweet-home/${code}/r/k1`;
                const rNodeK1SetSensorTopic = `${rootTopic}/sweet-home/${code}/r/k1/set`;
                const rNodeK2SensorErrorsTopic = `${rootTopic}/errors/sweet-home/${code}/r/k2`;
                const rNodeK2SetSensorTopic = `${rootTopic}/sweet-home/${code}/r/k2/set`;
                const rNodeK3SensorErrorsTopic = `${rootTopic}/errors/sweet-home/${code}/r/k3`;
                const rNodeK3SetSensorTopic = `${rootTopic}/sweet-home/${code}/r/k3/set`;

                SubjectClient.prototype.defaultAuthorizeForward = jest.fn();

                const result = client.getForwardTopicsMatchers(code);
                const dNodePropertiesTopicFn = result[dNodePropertiesTopic];
                const dNodeKSensorErrorsTopicFn = result[dNodeKSensorErrorsTopic];
                const dNodeKSetSensorTopicFn = result[dNodeKSetSensorTopic];
                const rNodeK1SensorErrorsTopicFn = result[rNodeK1SensorErrorsTopic];
                const rNodeK1SetSensorTopicFn = result[rNodeK1SetSensorTopic];
                const rNodeK2SensorErrorsTopicFn = result[rNodeK2SensorErrorsTopic];
                const rNodeK2SetSensorTopicFn = result[rNodeK2SetSensorTopic];
                const rNodeK3SensorErrorsTopicFn = result[rNodeK3SensorErrorsTopic];
                const rNodeK3SetSensorTopicFn = result[rNodeK3SetSensorTopic];

                dNodePropertiesTopicFn({});
                dNodeKSensorErrorsTopicFn({});
                dNodeKSetSensorTopicFn({});
                rNodeK1SensorErrorsTopicFn({});
                rNodeK1SetSensorTopicFn({});
                rNodeK2SensorErrorsTopicFn({});
                rNodeK2SetSensorTopicFn({});
                rNodeK3SensorErrorsTopicFn({});
                rNodeK3SetSensorTopicFn({});

                expect(result).toBeInstanceOf(Object);
                expect(result).toMatchObject({
                    [`${rootTopic}/sweet-home/${code}/+`]                 : true,
                    [`${rootTopic}/sweet-home/${code}/$fw/+`]             : true,
                    [`${rootTopic}/sweet-home/${code}/$options/k1`]       : true,
                    [`${rootTopic}/sweet-home/${code}/$options/k1/$name`] : true,
                    [`${rootTopic}/sweet-home/${code}/$options/k2`]       : true,
                    [`${rootTopic}/sweet-home/${code}/$options/k2/$name`] : true,
                    [`${rootTopic}/sweet-home/${code}/d/$name`]           : true,
                    [`${rootTopic}/sweet-home/${code}/d/$state`]          : true,
                    [`${rootTopic}/sweet-home/${code}/d/$properties`]     : expect.any(Function),
                    [`${rootTopic}/sweet-home/${code}/d/s`]               : true,
                    [`${rootTopic}/sweet-home/${code}/d/s/+`]             : true,
                    [`${rootTopic}/errors/sweet-home/${code}/d/s`]        : true,
                    [`${rootTopic}/errors/sweet-home/${code}/d/k`]        : expect.any(Function),
                    [`${rootTopic}/sweet-home/${code}/d/k/set`]           : expect.any(Function),
                    // "r" node
                    [`${rootTopic}/sweet-home/${code}/r/$name`]           : true,
                    [`${rootTopic}/sweet-home/${code}/r/$state`]          : true,
                    // "s1" sensor
                    [`${rootTopic}/sweet-home/${code}/r/s1`]              : true,
                    [`${rootTopic}/sweet-home/${code}/r/s1/+`]            : true,
                    [`${rootTopic}/errors/sweet-home/${code}/r/s1`]       : true,
                    [`${rootTopic}/errors/sweet-home/${code}/r/k1`]       : expect.any(Function),
                    [`${rootTopic}/sweet-home/${code}/r/k1/set`]          : expect.any(Function),
                    // "s2" sensor
                    [`${rootTopic}/sweet-home/${code}/r/s2`]              : true,
                    [`${rootTopic}/sweet-home/${code}/r/s2/+`]            : true,
                    [`${rootTopic}/errors/sweet-home/${code}/r/s2`]       : true,
                    [`${rootTopic}/errors/sweet-home/${code}/r/k2`]       : expect.any(Function),
                    [`${rootTopic}/sweet-home/${code}/r/k2/set`]          : expect.any(Function),
                    // "s3" sensor
                    [`${rootTopic}/sweet-home/${code}/r/s3`]              : true,
                    [`${rootTopic}/sweet-home/${code}/r/s3/+`]            : true,
                    [`${rootTopic}/errors/sweet-home/${code}/r/s3`]       : true,
                    [`${rootTopic}/errors/sweet-home/${code}/r/k3`]       : expect.any(Function),
                    [`${rootTopic}/sweet-home/${code}/r/k3/set`]          : expect.any(Function)
                });

                expect(SubjectClient.prototype.defaultAuthorizeForward).toHaveBeenCalledTimes(9);
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        1,
                        { payload: Buffer.from('s') }
                    );
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        2,
                        expect.objectContaining({
                            topic   : `${rootTopic}/errors/sweet-home/${code}/d/s`,
                            payload : Buffer.from(JSON.stringify({ code: 'Denied', message: 'Access denied' }))
                        })
                    );
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        3,
                        expect.objectContaining({
                            topic   : `${rootTopic}/sweet-home/${code}/d/s/set`,
                            payload : Buffer.from('true')
                        })
                    );
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        4,
                        expect.objectContaining({
                            topic   : `${rootTopic}/errors/sweet-home/${code}/r/s1`,
                            payload : Buffer.from(JSON.stringify({ code: 'Denied', message: 'Access denied' }))
                        })
                    );
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        5,
                        expect.objectContaining({
                            topic   : `${rootTopic}/sweet-home/${code}/r/s1/set`,
                            payload : Buffer.from('true')
                        })
                    );
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        6,
                        expect.objectContaining({
                            topic   : `${rootTopic}/errors/sweet-home/${code}/r/s2`,
                            payload : Buffer.from(JSON.stringify({ code: 'Denied', message: 'Access denied' }))
                        })
                    );
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        7,
                        expect.objectContaining({
                            topic   : `${rootTopic}/sweet-home/${code}/r/s2/set`,
                            payload : Buffer.from('true')
                        })
                    );
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        8,
                        expect.objectContaining({
                            topic   : `${rootTopic}/errors/sweet-home/${code}/r/s3`,
                            payload : Buffer.from(JSON.stringify({ code: 'Denied', message: 'Access denied' }))
                        })
                    );
                expect(SubjectClient.prototype.defaultAuthorizeForward)
                    .toHaveBeenNthCalledWith(
                        9,
                        expect.objectContaining({
                            topic   : `${rootTopic}/sweet-home/${code}/r/s3/set`,
                            payload : Buffer.from('true')
                        })
                    );
            });
        });
    });
});
