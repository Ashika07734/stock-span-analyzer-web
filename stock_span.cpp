#include <emscripten/bind.h>
#include <vector>

using namespace emscripten;

// Stock Span Algorithm
std::vector<int> calculateSpan(const std::vector<int>& prices) {
    std::vector<int> span(prices.size());
    std::vector<int> stack;

    for (int i = 0; i < prices.size(); ++i) {
        while (!stack.empty() && prices[stack.back()] <= prices[i]) {
            stack.pop_back();
        }
        span[i] = stack.empty() ? (i + 1) : (i - stack.back());
        stack.push_back(i);
    }

    return span;
}

// Binding the vector and function
EMSCRIPTEN_BINDINGS(stock_span_module) {
    register_vector<int>("VectorInt");
    function("calculateSpan", &calculateSpan);
}
