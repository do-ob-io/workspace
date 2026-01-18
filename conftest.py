"""Global pytest configuration for the monorepo workspace.

This conftest.py provides dynamic configuration for multiple Python projects
under the python/ directory, ensuring proper module resolution for each project.
"""

import sys
from pathlib import Path

import pytest


def pytest_configure(config: pytest.Config) -> None:  # noqa: ARG001
  """Configure pytest for monorepo workspace.

  Dynamically adjusts Python path based on the project being tested.
  Each project under python/ gets its own root directory added to sys.path.
  """
  # Get the workspace root directory
  workspace_root = Path(__file__).parent

  # Find all Python projects under python/
  python_dir = workspace_root / "python"
  if python_dir.exists():
    for project_dir in python_dir.iterdir():
      if project_dir.is_dir() and (project_dir / "pyproject.toml").exists():
        # Add each project directory to Python path
        project_path = str(project_dir)
        if project_path not in sys.path:
          sys.path.insert(0, project_path)


def pytest_collection_modifyitems(config: pytest.Config, items: list[pytest.Item]) -> None:  # noqa: ARG001
  """Modify test items to ensure proper project context.

  This ensures that tests run with the correct working directory
  and module resolution context for their respective projects.
  """
  for item in items:
    # Get the test file path
    test_path = Path(item.fspath)

    # Find the project root for this test
    for parent in test_path.parents:
      if parent.name == "python":
        continue
      if (parent / "pyproject.toml").exists() and parent.parent.name == "python":
        # This is a project directory under python/
        project_root = str(parent)
        if project_root not in sys.path:
          sys.path.insert(0, project_root)
        break
