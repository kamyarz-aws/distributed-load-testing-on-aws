"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const metrics_helper_1 = require("./helpers/metrics-helper");
const types_1 = require("./helpers/types");
/**
 * Metrics collector Lambda handler.
 * @param event The EventBridge or SQS request event.
 * @param _context The request context
 * @returns Processed request response.
 */
async function handler(event, _context) {
    const metricsHelper = new metrics_helper_1.MetricsHelper();
    console.log("Event: ", JSON.stringify(event, null, 2));
    const { EXECUTION_DAY } = process.env;
    if ((0, types_1.isEventBridgeQueryEvent)(event)) {
        event = event;
        console.info("Processing EventBridge event.");
        const endTime = new Date(event.time);
        const metricsData = await metricsHelper.getMetricsData(event);
        console.info("Metrics data: ", JSON.stringify(metricsData, null, 2));
        await metricsHelper.sendAnonymousMetric(metricsData, new Date(endTime.getTime() - (EXECUTION_DAY === types_1.ExecutionDay.DAILY ? 1 : 7) * 86400 * 1000), endTime);
        await metricsHelper.startQueries(event);
    }
    else if ((0, types_1.isSQSEvent)(event)) {
        event = event;
        console.info("Processing SQS event.");
        const body = JSON.parse(event.Records[0].body);
        const resolvedQueries = await metricsHelper.resolveQueries(event);
        console.debug(`Resolved Queries: ${JSON.stringify(resolvedQueries)}`);
        const metricsData = metricsHelper.processQueryResults(resolvedQueries, body);
        if (Object.keys(metricsData).length > 0) {
            await metricsHelper.sendAnonymousMetric(metricsData, new Date(body.endTime - (EXECUTION_DAY === types_1.ExecutionDay.DAILY ? 1 : 7) * 86400 * 1000), new Date(body.endTime));
        }
    }
    else {
        console.error("Invalid event type.");
        throw new Error("Invalid event type.");
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully processed event." }),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXFFO0FBQ3JFLHNDQUFzQzs7QUFvQnRDLDBCQXVDQztBQXZERCw2REFBeUQ7QUFDekQsMkNBT3lCO0FBRXpCOzs7OztHQUtHO0FBQ0ksS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUF1QyxFQUFFLFFBQWE7SUFDbEYsTUFBTSxhQUFhLEdBQUcsSUFBSSw4QkFBYSxFQUFFLENBQUM7SUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDdEMsSUFBSSxJQUFBLCtCQUF1QixFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbkMsS0FBSyxHQUFHLEtBQThCLENBQUM7UUFDdkMsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBRTlDLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLFdBQVcsR0FBRyxNQUFNLGFBQWEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRSxNQUFNLGFBQWEsQ0FBQyxtQkFBbUIsQ0FDckMsV0FBVyxFQUNYLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLGFBQWEsS0FBSyxvQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQzNGLE9BQU8sQ0FDUixDQUFDO1FBQ0YsTUFBTSxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7U0FBTSxJQUFJLElBQUEsa0JBQVUsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzdCLEtBQUssR0FBRyxLQUFpQixDQUFDO1FBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN0QyxNQUFNLElBQUksR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdELE1BQU0sZUFBZSxHQUFHLE1BQU0sYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRSxPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0RSxNQUFNLFdBQVcsR0FBZSxhQUFhLENBQUMsbUJBQW1CLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pGLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDeEMsTUFBTSxhQUFhLENBQUMsbUJBQW1CLENBQ3JDLFdBQVcsRUFDWCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsYUFBYSxLQUFLLG9CQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsRUFDdEYsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUN2QixDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7U0FBTSxDQUFDO1FBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBQ0QsT0FBTztRQUNMLFVBQVUsRUFBRSxHQUFHO1FBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsQ0FBQztLQUNuRSxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgeyBTUVNFdmVudCB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBNZXRyaWNzSGVscGVyIH0gZnJvbSBcIi4vaGVscGVycy9tZXRyaWNzLWhlbHBlclwiO1xuaW1wb3J0IHtcbiAgRXZlbnRCcmlkZ2VRdWVyeUV2ZW50LFxuICBFeGVjdXRpb25EYXksXG4gIE1ldHJpY0RhdGEsXG4gIFNRU0V2ZW50Qm9keSxcbiAgaXNFdmVudEJyaWRnZVF1ZXJ5RXZlbnQsXG4gIGlzU1FTRXZlbnQsXG59IGZyb20gXCIuL2hlbHBlcnMvdHlwZXNcIjtcblxuLyoqXG4gKiBNZXRyaWNzIGNvbGxlY3RvciBMYW1iZGEgaGFuZGxlci5cbiAqIEBwYXJhbSBldmVudCBUaGUgRXZlbnRCcmlkZ2Ugb3IgU1FTIHJlcXVlc3QgZXZlbnQuXG4gKiBAcGFyYW0gX2NvbnRleHQgVGhlIHJlcXVlc3QgY29udGV4dFxuICogQHJldHVybnMgUHJvY2Vzc2VkIHJlcXVlc3QgcmVzcG9uc2UuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBFdmVudEJyaWRnZVF1ZXJ5RXZlbnQgfCBTUVNFdmVudCwgX2NvbnRleHQ6IGFueSkge1xuICBjb25zdCBtZXRyaWNzSGVscGVyID0gbmV3IE1ldHJpY3NIZWxwZXIoKTtcbiAgY29uc29sZS5sb2coXCJFdmVudDogXCIsIEpTT04uc3RyaW5naWZ5KGV2ZW50LCBudWxsLCAyKSk7XG4gIGNvbnN0IHsgRVhFQ1VUSU9OX0RBWSB9ID0gcHJvY2Vzcy5lbnY7XG4gIGlmIChpc0V2ZW50QnJpZGdlUXVlcnlFdmVudChldmVudCkpIHtcbiAgICBldmVudCA9IGV2ZW50IGFzIEV2ZW50QnJpZGdlUXVlcnlFdmVudDtcbiAgICBjb25zb2xlLmluZm8oXCJQcm9jZXNzaW5nIEV2ZW50QnJpZGdlIGV2ZW50LlwiKTtcblxuICAgIGNvbnN0IGVuZFRpbWUgPSBuZXcgRGF0ZShldmVudC50aW1lKTtcbiAgICBjb25zdCBtZXRyaWNzRGF0YSA9IGF3YWl0IG1ldHJpY3NIZWxwZXIuZ2V0TWV0cmljc0RhdGEoZXZlbnQpO1xuICAgIGNvbnNvbGUuaW5mbyhcIk1ldHJpY3MgZGF0YTogXCIsIEpTT04uc3RyaW5naWZ5KG1ldHJpY3NEYXRhLCBudWxsLCAyKSk7XG4gICAgYXdhaXQgbWV0cmljc0hlbHBlci5zZW5kQW5vbnltb3VzTWV0cmljKFxuICAgICAgbWV0cmljc0RhdGEsXG4gICAgICBuZXcgRGF0ZShlbmRUaW1lLmdldFRpbWUoKSAtIChFWEVDVVRJT05fREFZID09PSBFeGVjdXRpb25EYXkuREFJTFkgPyAxIDogNykgKiA4NjQwMCAqIDEwMDApLFxuICAgICAgZW5kVGltZVxuICAgICk7XG4gICAgYXdhaXQgbWV0cmljc0hlbHBlci5zdGFydFF1ZXJpZXMoZXZlbnQpO1xuICB9IGVsc2UgaWYgKGlzU1FTRXZlbnQoZXZlbnQpKSB7XG4gICAgZXZlbnQgPSBldmVudCBhcyBTUVNFdmVudDtcbiAgICBjb25zb2xlLmluZm8oXCJQcm9jZXNzaW5nIFNRUyBldmVudC5cIik7XG4gICAgY29uc3QgYm9keTogU1FTRXZlbnRCb2R5ID0gSlNPTi5wYXJzZShldmVudC5SZWNvcmRzWzBdLmJvZHkpO1xuICAgIGNvbnN0IHJlc29sdmVkUXVlcmllcyA9IGF3YWl0IG1ldHJpY3NIZWxwZXIucmVzb2x2ZVF1ZXJpZXMoZXZlbnQpO1xuICAgIGNvbnNvbGUuZGVidWcoYFJlc29sdmVkIFF1ZXJpZXM6ICR7SlNPTi5zdHJpbmdpZnkocmVzb2x2ZWRRdWVyaWVzKX1gKTtcbiAgICBjb25zdCBtZXRyaWNzRGF0YTogTWV0cmljRGF0YSA9IG1ldHJpY3NIZWxwZXIucHJvY2Vzc1F1ZXJ5UmVzdWx0cyhyZXNvbHZlZFF1ZXJpZXMsIGJvZHkpO1xuICAgIGlmIChPYmplY3Qua2V5cyhtZXRyaWNzRGF0YSkubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgbWV0cmljc0hlbHBlci5zZW5kQW5vbnltb3VzTWV0cmljKFxuICAgICAgICBtZXRyaWNzRGF0YSxcbiAgICAgICAgbmV3IERhdGUoYm9keS5lbmRUaW1lIC0gKEVYRUNVVElPTl9EQVkgPT09IEV4ZWN1dGlvbkRheS5EQUlMWSA/IDEgOiA3KSAqIDg2NDAwICogMTAwMCksXG4gICAgICAgIG5ldyBEYXRlKGJvZHkuZW5kVGltZSlcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIGV2ZW50IHR5cGUuXCIpO1xuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZXZlbnQgdHlwZS5cIik7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIlN1Y2Nlc3NmdWxseSBwcm9jZXNzZWQgZXZlbnQuXCIgfSksXG4gIH07XG59XG4iXX0=