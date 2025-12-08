package org.expensetracker.service;

import org.expensetracker.dto.AI.CategorizeTransactionRequest;
import org.expensetracker.dto.AI.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final WebClient webClient;

    @Value("${chatgroq.api-key}")
    private String apiKey;

    public AIService(WebClient.Builder webClientBuilder){
        this.webClient = webClientBuilder
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public String categorizeTransaction(String description){

        String prompt = "Categorize this expense into one of [Food, Travel, Shopping, Movies, Bills, Subscriptions, Others]. "+
                        "Just give me the response in a JSON format like {category: , payment type: , type:(expense/income), amount: , description} everything should be a one word value and integer value for amount no need of any explanations give my payment type clearly, if it is a bank transfer give it Bank transfer, gpay or any other online payment methods give UPI like that follow for remaining as well also generate a professional description of around 5-6 words. it should look like a understandable description I want my response in JSON format"+
                        "Expense description: "+description;

        // Map<String,Object> requestBody = Map.of(
        //         "model","llama-3.3-70b-versatile",
        //         "messages", new Object[]{
        //                 Map.of("role","system","content","You are an expense categorization assistant"),
        //                 Map.of("role","user","content",prompt)
        //         }
        // );

        CategorizeTransactionRequest categorizeTransactionRequest = new CategorizeTransactionRequest(
                "llama-3.3-70b-versatile",
                List.of(
                        new Message("system","You are an expense categorization assistant"),
                        new Message("user",prompt)
                )
        );

        Map<String,Object> response = webClient.post()
                .uri("/chat/completions")
                .header("Authorization","Bearer "+apiKey)
                .bodyValue(categorizeTransactionRequest)
                .retrieve()
                .bodyToMono(Map.class)
                .block();


        List<Map<String,Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String,Object> choice1 = choices.get(0);
        Map<String,String> message = (Map<String, String>) choice1.get("message");
        String content = message.get("content");

        return content;
    }
}
