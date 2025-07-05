/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FraminoController } from './controller/framinoController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "DonateRequest": {
        "dataType": "refObject",
        "properties": {
            "amount": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NftMintRequest": {
        "dataType": "refObject",
        "properties": {
            "account": {"dataType":"string","required":true},
            "id": {"dataType":"double","required":true},
            "value": {"dataType":"double","required":true},
            "uri": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NftMarkCompletedRequest": {
        "dataType": "refObject",
        "properties": {
            "user": {"dataType":"string","required":true},
            "id": {"dataType":"double","required":true},
            "newUri": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetContractInfoResponseModel": {
        "dataType": "refObject",
        "properties": {
            "address": {"dataType":"string","required":true},
            "abi": {"dataType":"array","array":{"dataType":"any"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsFraminoController_donateUSDCWithPaymaster: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"DonateRequest"},
        };
        app.post('/framino/donate-USDC-with-paymaster',
            ...(fetchMiddlewares<RequestHandler>(FraminoController)),
            ...(fetchMiddlewares<RequestHandler>(FraminoController.prototype.donateUSDCWithPaymaster)),

            async function FraminoController_donateUSDCWithPaymaster(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFraminoController_donateUSDCWithPaymaster, request, response });

                const controller = new FraminoController();

              await templateService.apiHandler({
                methodName: 'donateUSDCWithPaymaster',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFraminoController_mintNftByWithPaymaster: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"NftMintRequest"},
        };
        app.post('/framino/mint-with-paymaster',
            ...(fetchMiddlewares<RequestHandler>(FraminoController)),
            ...(fetchMiddlewares<RequestHandler>(FraminoController.prototype.mintNftByWithPaymaster)),

            async function FraminoController_mintNftByWithPaymaster(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFraminoController_mintNftByWithPaymaster, request, response });

                const controller = new FraminoController();

              await templateService.apiHandler({
                methodName: 'mintNftByWithPaymaster',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFraminoController_markCompleted: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"NftMarkCompletedRequest"},
        };
        app.post('/framino/mark-completed-with-paymaster',
            ...(fetchMiddlewares<RequestHandler>(FraminoController)),
            ...(fetchMiddlewares<RequestHandler>(FraminoController.prototype.markCompleted)),

            async function FraminoController_markCompleted(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFraminoController_markCompleted, request, response });

                const controller = new FraminoController();

              await templateService.apiHandler({
                methodName: 'markCompleted',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFraminoController_getContractInfo: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/framino/contract',
            ...(fetchMiddlewares<RequestHandler>(FraminoController)),
            ...(fetchMiddlewares<RequestHandler>(FraminoController.prototype.getContractInfo)),

            async function FraminoController_getContractInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFraminoController_getContractInfo, request, response });

                const controller = new FraminoController();

              await templateService.apiHandler({
                methodName: 'getContractInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
