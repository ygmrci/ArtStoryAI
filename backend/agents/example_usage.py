"""
Example Usage of ArtStoryAI Agents

This script demonstrates how to use the various agents in the ArtStoryAI application.
"""

import asyncio
import json
from agent_manager import agent_manager


async def example_1_basic_artwork_analysis():
    """
    Example 1: Basic artwork analysis using the workflow.
    """
    print("=" * 60)
    print("EXAMPLE 1: Basic Artwork Analysis")
    print("=" * 60)
    
    # Set up agents
    agent_manager.setup_default_agents()
    
    # Analyze an artwork
    result = await agent_manager.run_artwork_analysis_workflow(
        artwork_name="Ayçiçekleri",
        artist_name="Vincent van Gogh",
        style="romantic"
    )
    
    if result["success"]:
        print("✅ Analysis completed successfully!")
        print(f"🎨 Artwork: {result['artwork_info']['artwork_name']}")
        print(f"👨‍🎨 Artist: {result['artwork_info']['artist_name']}")
        print(f"📅 Year: {result['artwork_info']['year']}")
        print(f"🎭 Technique: {result['artwork_info']['technique']}")
        print(f"📖 Story: {result['artwork_info']['story']}")
        
        if result['content']:
            print(f"📝 Generated Content: {result['content']['content']}")
    else:
        print(f"❌ Analysis failed: {result['error']}")


async def example_2_individual_agent_usage():
    """
    Example 2: Using individual agents separately.
    """
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Individual Agent Usage")
    print("=" * 60)
    
    # Set up agents
    agent_manager.setup_default_agents()
    
    # Use ArtworkAnalyzer agent directly
    print("🔍 Using ArtworkAnalyzer agent...")
    analysis_result = await agent_manager.run_agent("ArtworkAnalyzer", {
        "artwork_name": "Mona Lisa",
        "artist_name": "Leonardo da Vinci",
        "style": "educational",
        "language": "tr"
    })
    
    if analysis_result.success:
        print("✅ Artwork analysis completed!")
        print(f"📊 Data: {json.dumps(analysis_result.data, indent=2, ensure_ascii=False)}")
        
        # Use ContentGenerator agent with the analysis result
        print("\n📝 Using ContentGenerator agent...")
        content_result = await agent_manager.run_agent("ContentGenerator", {
            "content_type": "social",
            "artwork_info": analysis_result.data,
            "style": "medium"
        })
        
        if content_result.success:
            print("✅ Content generation completed!")
            print("📱 Social Media Content:")
            print(content_result.data["content"]["full_post"])
        else:
            print(f"❌ Content generation failed: {content_result.message}")
    else:
        print(f"❌ Artwork analysis failed: {analysis_result.message}")


async def example_3_content_generation_types():
    """
    Example 3: Different types of content generation.
    """
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Different Content Generation Types")
    print("=" * 60)
    
    # Set up agents
    agent_manager.setup_default_agents()
    
    artwork_info = {
        "title": "Yıldızlı Gece",
        "artist": "Vincent van Gogh",
        "year": "1889",
        "movement": "Post-empresyonizm",
        "technique": "Yağlı boya",
        "description": "Van Gogh'un en ünlü eserlerinden biri, gece gökyüzünün dinamik tasviri."
    }
    
    content_types = ["title", "description", "social", "metadata"]
    
    for content_type in content_types:
        print(f"\n🎯 Generating {content_type} content...")
        result = await agent_manager.run_agent("ContentGenerator", {
            "content_type": content_type,
            "artwork_info": artwork_info,
            "style": "medium"
        })
        
        if result.success:
            print(f"✅ {content_type.title()} generated successfully!")
            if content_type == "social":
                print("📱 Social Media Post:")
                print(result.data["content"]["full_post"])
            elif content_type == "metadata":
                print("🏷️ Metadata:")
                print(json.dumps(result.data["content"], indent=2, ensure_ascii=False))
            else:
                print(f"📄 {content_type.title()}: {result.data['content']}")
        else:
            print(f"❌ {content_type} generation failed: {result.message}")


async def example_4_workflow_management():
    """
    Example 4: Workflow management and monitoring.
    """
    print("\n" + "=" * 60)
    print("EXAMPLE 4: Workflow Management")
    print("=" * 60)
    
    # Set up agents
    agent_manager.setup_default_agents()
    
    # List all agents
    print("🤖 Registered Agents:")
    for agent_name in agent_manager.list_agents():
        print(f"  - {agent_name}")
    
    # Get agent status
    print("\n📊 Agent Status:")
    status = agent_manager.get_agent_status()
    for agent_name, agent_status in status.items():
        print(f"  - {agent_name}: {'🟢 Running' if agent_status['is_running'] else '🔴 Idle'}")
    
    # Create a custom workflow
    print("\n🔄 Creating custom workflow...")
    try:
        agent_manager.create_workflow("custom_analysis", ["ArtworkAnalyzer"])
        print("✅ Custom workflow created successfully!")
    except ValueError as e:
        print(f"❌ Workflow creation failed: {e}")
    
    # Run custom workflow
    print("\n🚀 Running custom workflow...")
    workflow_result = await agent_manager.run_workflow("custom_analysis", {
        "artwork_name": "Scream",
        "artist_name": "Edvard Munch",
        "style": "storytelling"
    })
    
    if "error" not in workflow_result:
        print("✅ Custom workflow completed successfully!")
        for agent_name, result in workflow_result.items():
            print(f"  - {agent_name}: {'✅ Success' if result.success else '❌ Failed'}")
    else:
        print(f"❌ Custom workflow failed: {workflow_result['error'].message}")


async def example_5_error_handling():
    """
    Example 5: Error handling and validation.
    """
    print("\n" + "=" * 60)
    print("EXAMPLE 5: Error Handling")
    print("=" * 60)
    
    # Set up agents
    agent_manager.setup_default_agents()
    
    # Test with invalid input
    print("🧪 Testing with invalid input...")
    invalid_result = await agent_manager.run_agent("ArtworkAnalyzer", {
        "invalid_field": "test"
    })
    
    print(f"Result: {'✅ Success' if invalid_result.success else '❌ Failed'}")
    print(f"Message: {invalid_result.message}")
    
    # Test with non-existent agent
    print("\n🧪 Testing with non-existent agent...")
    non_existent_result = await agent_manager.run_agent("NonExistentAgent", {})
    
    print(f"Result: {'✅ Success' if non_existent_result.success else '❌ Failed'}")
    print(f"Message: {non_existent_result.message}")
    
    # Test with empty artwork name
    print("\n🧪 Testing with empty artwork name...")
    empty_result = await agent_manager.run_agent("ArtworkAnalyzer", {
        "artwork_name": "",
        "artist_name": "Test Artist"
    })
    
    print(f"Result: {'✅ Success' if empty_result.success else '❌ Failed'}")
    print(f"Message: {empty_result.message}")


async def main():
    """
    Run all examples.
    """
    print("🎨 ArtStoryAI Agents - Example Usage")
    print("This script demonstrates various ways to use the ArtStoryAI agents.\n")
    
    try:
        await example_1_basic_artwork_analysis()
        await example_2_individual_agent_usage()
        await example_3_content_generation_types()
        await example_4_workflow_management()
        await example_5_error_handling()
        
        print("\n" + "=" * 60)
        print("🎉 All examples completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main()) 