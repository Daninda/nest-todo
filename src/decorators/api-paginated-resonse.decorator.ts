/* eslint-disable @typescript-eslint/ban-types */
import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

type TApiPaginatedResonse = {
  <TModel1 extends Type<any>, TModel2 extends Type<any>>(
    parentModel: TModel1,
    parentChildModel: TModel2,
    parentChildProperty: string,
  ): <TFunction extends Function, Y>(
    target: object | TFunction,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>,
  ) => void;

  <
    TModel1 extends Type<any>,
    TModel2 extends Type<any>,
    TModel3 extends Type<any>,
  >(
    parentModel: TModel1,
    parentChildModel: TModel2,
    parentChildProperty: string,
    childModel: TModel3,
    childProperty: string,
  ): <TFunction extends Function, Y>(
    target: object | TFunction,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>,
  ) => void;
};

export const ApiPaginatedResponse: TApiPaginatedResonse = <
  TModel1 extends Type<any>,
  TModel2 extends Type<any>,
  TModel3 extends Type<any>,
>(
  parentModel: TModel1,
  parentChildModel: TModel2,
  parentChildProperty: string,
  childModel?: TModel3,
  childProperty?: string,
) => {
  if (childModel == undefined) {
    return applyDecorators(
      ApiExtraModels(parentModel, parentChildModel),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(parentModel) },
            {
              properties: {
                [parentChildProperty]: {
                  type: 'array',
                  items: { $ref: getSchemaPath(parentChildModel) },
                },
              },
            },
          ],
        },
      }),
    );
  } else {
    return applyDecorators(
      ApiExtraModels(parentModel, parentChildModel, childModel),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(parentModel) },
            {
              properties: {
                [parentChildProperty]: {
                  type: 'array',
                  items: {
                    allOf: [
                      { $ref: getSchemaPath(parentChildModel) },
                      {
                        properties: {
                          [childProperty]: {
                            type: 'array',
                            items: { $ref: getSchemaPath(childModel) },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      }),
    );
  }
};
