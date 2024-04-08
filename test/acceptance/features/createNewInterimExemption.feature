Feature: Create new interim exemption

    Scenario: Enter new owner details
        Given I open the url "/"
        When I click on the link containing "Process new CDO or"
        And I set "Mike" to the inputfield "#firstName"
        And I set "Clark" to the inputfield "#lastName"
        And I set "03" to the inputfield "#dateOfBirth-day"
        And I set "03" to the inputfield "#dateOfBirth-month"
        And I set "1980" to the inputfield "#dateOfBirth-year"
        And I click on the element "button=Continue"
        Then I expect that element "h1" contains the text "What is the owner's postcode?"

    Scenario: Enter address
        And I set "CF14 9JF" to the inputfield "#postcode"
        And I set "94" to the inputfield "#houseNumber"
        And I click on the element "button=Continue"
        Then I expect that element "form" contains the text "94 HEOL LLINOS"

    Scenario: Confirm address
        And I click on the element "button=Confirm address"
        Then I expect that container "h1" contains the text "What is the microchip number?"

    Scenario: Enter microchip number
        And I set "345671234512345" to the inputfield "#microchipNumber"
        And I click on the element "button=Continue"
        Then I expect that container "h1" contains the text "Add dog details"

    Scenario: Enter dog details
        When I select the radio option with the value "Dogo Argentino" from the radio group "breed"
        And I set "Bruno" to the inputfield "#name"
        And I select the radio option with the value "interim-exemption" from the radio group "applicationType"
        And I set "01" to the inputfield "#interimExemption-day"
        And I set "02" to the inputfield "#interimExemption-month"
        And I set "2024" to the inputfield "#interimExemption-year"
        And I click on the element "button=Add dog details"
        Then I expect that element "h1" contains the text "Confirm dog details"
        And I expect that element "(//dd)[1]" contains the text "Dogo Argentino"
        And I expect that element "(//dd)[2]" contains the text "Bruno"
        And I expect that element "(//dd)[3]" contains the text "345671234512345"
        And I expect that element "(//dd)[4]" contains the text "01 February 2024" 

    Scenario: Confirm dog details
        And I click on the element "button=Confirm details"
        Then I expect that element "h1" contains the text "Enter police and court details"

    Scenario: Enter enforcement details and Confirm all details
        And I set "Jonathan" to the inputfield "#legislationOfficer"
        And I click on the element "button=Continue"
        Then I expect that element "h1" contains the text "Confirm all details"
        And I expect that element "(//dd)[1]" contains the text "Mike Clark"
        And I expect that element "(//dd)[3]" contains the text "03 March 1980"
        And I expect that element "(//dd)[5]" contains the text "CF14 9JF"
        And I expect that element "(//dd)[7]" contains the text "Wales"
        And I expect that element "(//dd)[8]" contains the text "South Wales Police"
        And I expect that element "(//dd)[9]" contains the text "Jonathan"
        And I expect that element "(//dd)[10]" not contains any text
        And I expect that element "(//dd)[11]" contains the text "Dogo Argentino"
        And I expect that element "(//dd)[12]" contains the text "Bruno"
        And I expect that element "(//dd)[13]" contains the text "345671234512345"
        And I expect that element "(//dd)[14]" contains the text "01 February 2024"

    Scenario: Interim exemption record created successfully
        And I click on the element "button=Confirm details"
        Then I expect that element "h1" contains the text "Record created" 
        And I expect that element "(//dd)[1]" contains the text "Dogo Argentino"
        And I expect that element "(//dd)[2]" contains the text "Bruno"
        And I expect that element "(//dd)[3]" contains the text "345671234512345"
        And I expect that element "(//dd)[4]" contains the text "01 February 2024"
        And I expect that element "(//dd)[5]" contains the text "Mike Clark"
        And I expect that element "(//dd)[6]" contains the text "03 March 1980"
        And I expect that element "(//dd)[7]" contains the text "CF14 9JF"
        And I expect that element "(//dd)[8]" contains the text "Wales"
        And I expect that element "(//dd)[9]" contains the text "South Wales Police"  
        And I expect that element "(//dd)[10]" contains the text "Jonathan"         