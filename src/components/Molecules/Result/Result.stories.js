import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Result from './Result';
import '../../Atoms/Layout/Layout.css';

const questionnaireData = {
    config: {
        language: {
            default: 'en',
            languages: [
                {
                    short: 'de',
                    long: 'Deutsch'
                },
                {
                    short: 'en',
                    long: 'English'
                }
            ]
        },
        graphs: {
            default: 'polar',
            showGraphSwitch: '1',
            graphSwitchOptions: {
                options: ['radar', 'doughnut', 'polar', 'ownbar', 'bar']
            }
        },
        comment: '',
        showHeaderButton: '1',
        mainColors: {
            primaryColor: 'rgb(44,137,106)',
            secondaryColor: 'rgb(241,162,162)'
        },
        questionnaireFileName: 'new_9'
    },
    head: {
        title: {
            de: 'sefs',
            en: 'sef'
        },
        button: {
            text: {
                de: 'sefse',
                en: 'sef'
            },
            link: 'example: https://reveal-eu.org/'
        },
        logo: {
            showLogo: '1',
            url:
                'https://reveal-eu.org/wp-content/uploads/2019/01/rest_label_final_rgb_72-e1548100064323.jpg'
        },
        backgroundImage: {
            showBackgroundImage: '1',
            backgroundUrl:
                'http://wp.questionnaire.local/wp-content/uploads/2019/03/header-e1552486860741.png'
        }
    },
    categories: [
        {
            categoryName: {
                de: 'zjtzjtzj',
                en: 'drgdrg'
            },
            evaluateCategory: '0',
            categoryPages: [
                {
                    pageInformations: {
                        '@attributes': {
                            position_to_catname: 'before'
                        },
                        showPageInformations: '1',
                        pageInformationsDescription: {
                            de: '<p>sdrgdsrg</p>',
                            en: '<p>sdrgsdrg</p>'
                        },
                        pageInformationsSubtitle: {
                            de: 'drgdr',
                            en: 'dgdrg'
                        }
                    },
                    blocks: [
                        {
                            '@attributes': {
                                type: 'input'
                            },
                            blockQuestion: {
                                de: 'Name',
                                en: 'Name'
                            },
                            blockAnswers: [
                                {
                                    blockAnswer: {
                                        de: '',
                                        en: ''
                                    },
                                    answerValue: 5
                                }
                            ],
                            result_for_diagram: 0
                        }
                    ],
                    pageEvaluate: '0'
                }
            ]
        },
        {
            categoryName: {
                de: 'sdrgsdrg',
                en: 'sdrgsdrg'
            },
            evaluateCategory: '1',
            categoryPages: [
                {
                    pageInformations: {
                        '@attributes': {
                            position_to_catname: 'before'
                        },
                        showPageInformations: '0',
                        pageInformationsDescription: {
                            de: '',
                            en: ''
                        },
                        pageInformationsSubtitle: {
                            de: '',
                            en: ''
                        }
                    },
                    blocks: [
                        {
                            '@attributes': {
                                type: 'radio'
                            },
                            blockQuestion: {
                                de: 'sdrgsdrg',
                                en: 'Searching'
                            },
                            blockAnswers: [
                                {
                                    blockAnswer: {
                                        de: 'sdrgsdrg',
                                        en: 'sdrgsdrg'
                                    },
                                    answerValue: 6
                                }
                            ],
                            result_for_diagram: 7
                        },
                        {
                            '@attributes': {
                                type: 'check'
                            },
                            blockQuestion: {
                                de: 't5w5et',
                                en: 'e4te4tew4t'
                            },
                            blockAnswers: [
                                {
                                    blockAnswer: {
                                        de: 'we4twe4t',
                                        en: 'w4etwe4t'
                                    },
                                    answerValue: 1
                                },
                                {
                                    blockAnswer: {
                                        de: 'we4twe4t',
                                        en: 'we4twe4t'
                                    },
                                    answerValue: 2
                                },
                                {
                                    blockAnswer: {
                                        de: 'w4twe4t',
                                        en: 'w4twe4t'
                                    },
                                    answerValue: 3
                                },
                                {
                                    blockAnswer: {
                                        de: 'we4twe4t',
                                        en: 'w4etwe4t'
                                    },
                                    answerValue: 4
                                }
                            ],
                            result_for_diagram: 10
                        }
                    ],
                    pageEvaluate: '1'
                },
                {
                    pageInformations: {
                        '@attributes': {
                            position_to_catname: 'before'
                        },
                        showPageInformations: '1',
                        pageInformationsDescription: {
                            de:
                                '<p><img src=\'http://wp.questionnaire.local/wp-content/uploads/2019/03/header-e1552486860741.png\' alt=\'\' width=\'1186\' height=\'207\' /></p>',
                            en:
                                '<p><img src=\'http://wp.questionnaire.local/wp-content/uploads/2019/03/header-e1552486860741.png\' alt=\'\' width=\'958\' height=\'167\' /></p>'
                        },
                        pageInformationsSubtitle: {
                            de: 'drfgedrg',
                            en: 'drgdrg'
                        }
                    },
                    blocks: [
                        {
                            '@attributes': {
                                type: 'radio'
                            },
                            blockQuestion: {
                                de: 'fwefwef',
                                en: 'wefwef'
                            },
                            blockAnswers: [
                                {
                                    blockAnswer: {
                                        de: 'awdawd',
                                        en: 'awdaw'
                                    },
                                    answerValue: 5
                                },
                                {
                                    blockAnswer: {
                                        de: 'awdawd',
                                        en: 'awdawd'
                                    },
                                    answerValue: 5
                                },
                                {
                                    blockAnswer: {
                                        de: 'awdawd',
                                        en: 'awdawd'
                                    },
                                    answerValue: 5
                                }
                            ],
                            result_for_diagram: 5
                        },
                        {
                            '@attributes': {
                                type: 'radio'
                            },
                            blockQuestion: {
                                de: 'awdawd',
                                en: 'awdawd'
                            },
                            blockAnswers: [
                                {
                                    blockAnswer: {
                                        de: 'adawd',
                                        en: 'awdawd'
                                    },
                                    answerValue: 5
                                },
                                {
                                    blockAnswer: {
                                        de: 'awdawd',
                                        en: 'awdawdawd'
                                    },
                                    answerValue: 5
                                }
                            ],
                            result_for_diagram: 5
                        }
                    ],
                    pageEvaluate: '1'
                }
            ],
            catcolor: 'rgba(59,112,72,1)'
        },
        {
            categoryName: {
                de: 'wadawd',
                en: 'awdawd'
            },
            evaluateCategory: '1',
            categoryPages: [
                {
                    pageInformations: {
                        '@attributes': {
                            position_to_catname: 'before'
                        },
                        showPageInformations: '0',
                        pageInformationsDescription: {
                            de: '',
                            en: ''
                        },
                        pageInformationsSubtitle: {
                            de: '',
                            en: ''
                        }
                    },
                    blocks: [
                        {
                            '@attributes': {
                                type: 'radio'
                            },
                            blockQuestion: {
                                de: 'awdawd',
                                en: 'awdawd'
                            },
                            blockAnswers: [
                                {
                                    blockAnswer: {
                                        de: 'awdawd',
                                        en: 'awdawdawd'
                                    },
                                    answerValue: 5
                                },
                                {
                                    blockAnswer: {
                                        de: 'awdawd',
                                        en: 'awawdawdawd'
                                    },
                                    answerValue: 5
                                }
                            ],
                            result_for_diagram: 5
                        },
                        {
                            '@attributes': {
                                type: 'radio'
                            },
                            blockQuestion: {
                                de: 'awdawd',
                                en: 'awdawdawd'
                            },
                            blockAnswers: [
                                {
                                    blockAnswer: {
                                        de: 'awdawd',
                                        en: 'awdawd'
                                    },
                                    answerValue: 5
                                },
                                {
                                    blockAnswer: {
                                        de: 'awdawd',
                                        en: 'awdawd'
                                    },
                                    answerValue: 5
                                }
                            ],
                            result_for_diagram: 5
                        }
                    ],
                    pageEvaluate: '1'
                }
            ],
            catcolor: 'rgba(95,77,173,1)'
        }
    ],
    resultpage: {
        header: {
            title: {
                de: 'sdrgsdrg  %%#p1b1#%%',
                en: 'sdrgsdrg'
            },
            description: {
                de:
                    '<p>sdrgsdrg</p><p><span style=\'color: rgba(0, 0, 0, 0.87); font-family: Roboto, \'Helvetica Neue\', sans-serif;\'>&nbsp;%%#p1b1#%%</span></p>',
                en:
                    '<p>srgsdrg</p><p><span style=\'color: rgba(0, 0, 0, 0.87); font-family: Roboto, \'Helvetica Neue\', sans-serif;\'>&nbsp;%%#p1b1#%%</span></p>'
            }
        },
        body: {
            showtomsstyle: '0',
            literature: {
                '0': '',
                '@attributes': {
                    required: '0'
                }
            },
            interpretation: [
                {
                    '@attributes': {
                        required: '1'
                    },
                    description: {
                        de: '',
                        en: ''
                    }
                },
                {
                    '@attributes': {
                        required: '1'
                    },
                    description: {
                        de: '',
                        en: ''
                    },
                    image_categories: [
                        {
                            de: '',
                            en: ''
                        },
                        {
                            de: '',
                            en: ''
                        },
                        {
                            de: '',
                            en: ''
                        },
                        {
                            de: '',
                            en: ''
                        }
                    ]
                }
            ]
        }
    },
    number_of_blocks_overall: 7,
    maxValueInAllCategories: 10
};

const categoryValues = [0, 26, 10];

const values_not_for_categories = [
    {
        '0': 'David'
    }
];

const cat_values_all_top = [0, 91];
const cat_values_b_low = [0, 91];
const cat_values_a_and_c_middle = [0, 46, 30, 15, 30];
const cat_values_c_and_d_middle = [0, 91, 30, 15, 15];
// const values_not_for_categories = {
//     '1': 'David',
//     '2': 'Pohl',
//     '3': 'male',
//     birthday: '07.02.1976'
// };

storiesOf('Result', module)
    // .add('all top', () => (
    //     <Result
    //         language="de"
    //         categoryValues={cat_values_all_top}
    //         questionnaireData={questionnaireData}
    //         values_not_for_categories={values_not_for_categories}
    //     />
    // ))
    // .add('b_low', () => (
    //     <Result
    //         language="de"
    //         categoryValues={cat_values_b_low}
    //         questionnaireData={questionnaireData}
    //         values_not_for_categories={values_not_for_categories}
    //     />
    // ))
    // .add('diagram', () => (
    //     <Result
    //         language="en"
    //         categoryValues={cat_values_b_low}
    //         questionnaireData={questionnaireData}
    //         values_not_for_categories={values_not_for_categories}
    //     />
    // ))
    // .add('a and c middle', () => (
    //     <Result
    //         language="en"
    //         categoryValues={cat_values_a_and_c_middle}
    //         questionnaireData={questionnaireData}
    //         values_not_for_categories={values_not_for_categories}
    //     />
    // ))
    .add('last version', () => (
        <Result
            language="en"
            categoryValues={categoryValues}
            questionnaireData={questionnaireData}
            values_not_for_categories={values_not_for_categories}
        />
    ));
