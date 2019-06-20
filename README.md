# Repo Analyzers

Infrastructure for analyzing TypeScript repository using static analysis.

## Motivation

Especially in larger projects we want to **analyze** and **enforce** certain things across certain segments or all of the code repository. For enforcement we can usually use custom TSLint rules but some types of analysis and modifications are outside of the scope of TSLint. This project aims to provide a common infrastructure for creating code that be can used both in custom TSLint rules and different kinds of static analysis.

## Terms

* Analyzer: A unit of code that is used for analyzing/modifying code in a repository. Analyzers use walkers to extract information from source files, process the information and create an output/modification based on that information.
* Rule: A TSlint based custom rule. Rules use walkers for finding errors/deviations in source files.
* Walker: A unit of code for processing the AST of source files.

## Project structure

* `./base`: Contains the base classes for writing analyzers/rules and the engine for executing analyzers.
* `./cli`: Contains the CLI tool for running analyzers from the command line.
* `./analyzers`: Contains common analyzers.
* `./rules`: Contains common TSLint rules.
* `./walkers`: Contains common walkers used by both analyzers and rules.
* `./utils`: Contains utility functions (currently used for testing).
* `./example-client`: Contains an example client for the CLI.

## Creating an Analyzer

Analyzers are classes that derive from the abstract `RepoAnalyzerBase` or `RepoAnalyzerWithOptionsBase`. They live in the `./analyzers` subdirectory and the file name must end with -analyzer.ts.

The base class contains two (or three) main hook methods that need to be implemented:
* `initialize()`: This method is used for wiring up the parts of this analyzer. Usually this means registering some walkers, processing their results and then aggregate these into an object returned by `getResult()`.
* `getResult()`: Returns the compiled result that this analyzer has generated after processing.
* `getExampleOptions()`: Provides the CLI with example options (only applies to analyzer with options).

## Creating a Walker

Walkers derive either from `CodeWalkerBase` or `CodeAutoWalkerBase` that offer two different ways of traversing the AST. It is preferred to use CodeWalkerBase for performance reasons.

## Running the Example Client

First:

* Prepare the project: `npm install`
* Initialize the project: `npm run init`

Navigate to `example-client` and then use `npm start`;
