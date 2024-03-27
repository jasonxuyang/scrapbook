//   Description:
//     take the takes the stringified  document, as well as 
//     the sections in the currently selected template, passes 
//     it to openai and has chatgpt basically say if the 
//     document fulfills each section.
//   Input:
//     documentText: the document in the stringified
//     templateSections: an array of multiple TemplateSectionParams (like the SectionParams in original types)
//   Output:
//     Evaluation: a dict (like the Generation in original types)
//                 type: simply the "evaluation"
//                 data: an array of dict 
//                     [{section: section name, done: if have done this section true or false}, ...]

import {
    TemplateSection,
    Evaluation,
  } from "@/types";
  import { openai } from "@/utils/server/open_ai";
  import { NextApiRequest, NextApiResponse } from "next";
  import {
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
  } from "openai/resources/index.mjs";
  
  const EvaluateDoneSectionsSystemMessages = (): ChatCompletionSystemMessageParam[] => {
    return [
      {
        role: "system",
        content: 'You are an assistant that checks if the given document has completed which sections of a given template. Each section in the template will have a title, some key sentences, and key words, which could help you pinpoint the content.',
      },
    ];
  };
  
  type TemplateSectionParams = {
    sectionTitle: TemplateSection["title"];
    sectionKeySentences: TemplateSection["keySentences"];
    sectionKeywords: TemplateSection["keywords"];
  };
  type EvaluateDoneSectionsUserParams = {
    documentText: string;
    templateSections: TemplateSectionParams[];
  };
  const EvaluateDoneSectionsUserMessages = ({
    documentText,
    templateSections,
  }: EvaluateDoneSectionsUserParams): ChatCompletionUserMessageParam[] => {
    let temp_sections_description = "Here are sections I wish to complete in my template:"
    for (let idx=0; idx < templateSections.length; idx++){
        temp_sections_description += `\n${idx}. ${templateSections[idx].sectionTitle}:`
        temp_sections_description += `\nKey Words: ${templateSections[idx].sectionKeySentences}`
        temp_sections_description += `\nKey Sentences: ${templateSections[idx].sectionKeywords}`
    }
    temp_sections_description += "Please check each section that if I have done or not."

    return [
      {
        role: "user",
        content: `Here is the document I have writen:\n\n${documentText}`,
      },
      {
        role: "user",
        content: temp_sections_description,
      },
      {
        role: "user",
        content: "Only return your answer into the following JSON format: {\"section_index\":{\"title\":\"section_title\", \"done\":\"if_this_section_done_true_or_false\"}, ...}"
      }
    ];
  };
  
  export type EvaluateDoneSectionsParams = EvaluateDoneSectionsUserParams;
  
  const EvaluateDoneSections = async ({
    documentText,
    templateSections,
  }: EvaluateDoneSectionsParams) => {
    const completion = await openai.chat.completions.create({
      messages: [
        ...EvaluateDoneSectionsSystemMessages(),
        ...EvaluateDoneSectionsUserMessages({
            documentText,
            templateSections,
        }),
      ],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content;
  };
  
  export type ResponseData = { successs: boolean; data: Evaluation | null };
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    switch (req.method) {
      case "POST": {
        const {
            documentText,
            templateSections,
        } = req.body;
  
        const evaluationStr = await EvaluateDoneSections({
            documentText,
            templateSections,
        });

        if (evaluationStr){
            let evaluationJsonStr = evaluationStr.match(/\{.*\}/g)
            if (evaluationJsonStr){
                let evaluationJSON = JSON.parse(evaluationJsonStr[0])
                let result = []
                for (const idx in evaluationJSON){
                    result.push({
                        sectionTitle: evaluationJSON[idx]['title'],
                        sectionDone: evaluationJSON[idx]['done']
                    })
                }
    
                res.status(200).json({
                successs: true,
                data: 
                    {
                        type: "evaluation",
                        content: result,
                    },
                });
            }
            else{
                res.status(500).json({
                    successs: false,
                    data: null
                    });
            }
        }
        else{
            res.status(500).json({
                successs: false,
                data: null
                });
        }
        break;
      }
    }
  }
  